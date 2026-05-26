const fs = require('fs');
const path = require('path');
const Report = require('../models/report.model');
const User = require('../models/user.model');
const { extractTextFromImage, analyzeMedicalReport } = require('../services/gemini.service');
const { retrieveMedicalContext } = require('../services/rag.service');

let pdfParse;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  console.warn('pdf-parse not available:', e.message);
}

const applyAnalysisToReport = (report, analysis, ragContext) => {
  report.set('analysis', {
    summary: analysis.summary || '',
    reportType: analysis.reportType || '',
    patientInfo: analysis.patientInfo || {},
    diseases: analysis.diseases || [],
    medicines: analysis.medicines || [],
    abnormalValues: analysis.abnormalValues || [],
    precautions: analysis.precautions || [],
    foodSuggestions: analysis.foodSuggestions || [],
    lifestyleSuggestions: analysis.lifestyleSuggestions || [],
    seriousWarnings: analysis.seriousWarnings || [],
    generalExplanation: analysis.generalExplanation || '',
    doctorAdvice: analysis.doctorAdvice || '',
    ragContext: ragContext ? 'Medical context retrieved and used for enhanced analysis.' : ''
  });
  report.markModified('analysis');
};

/**
 * Background job: extract text + Gemini analysis (can take 30–90s)
 */
const processReportAnalysis = async (reportId, fileMeta) => {
  const { filePath, mimetype, originalname } = fileMeta;
  const report = await Report.findById(reportId);
  if (!report || report.status !== 'processing') return;

  try {
    let extractedText = '';

    if (mimetype === 'application/pdf') {
      if (!pdfParse) {
        throw new Error('PDF processing is not available. Please upload an image instead.');
      }
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(pdfBuffer);
      extractedText = pdfData.text || '';
    } else {
      extractedText = await extractTextFromImage(filePath, mimetype);
    }

    if (!extractedText || extractedText.trim().length < 10) {
      extractedText = `[File: ${originalname}] - Medical document uploaded for analysis`;
    }

    const ragContext = retrieveMedicalContext(extractedText);
    const analysis = await analyzeMedicalReport(extractedText, ragContext);

    report.extractedText = extractedText;
    applyAnalysisToReport(report, analysis, ragContext);
    report.status = 'completed';
    report.errorMessage = undefined;
    await report.save();

    await User.findByIdAndUpdate(report.user, { $inc: { reportsCount: 1 } });
    console.log(`Report ${reportId} analysis completed`);
  } catch (error) {
    console.error(`Report ${reportId} analysis failed:`, error.message);
    await Report.findByIdAndUpdate(reportId, {
      status: 'failed',
      errorMessage: error.message || 'Analysis failed'
    });
  }
};

/**
 * Upload file → return immediately → analyze in background
 */
const uploadReport = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    if (!process.env.GEMINI_API_KEY?.trim().startsWith('AIza')) {
      return res.status(503).json({
        success: false,
        message: 'AI is not configured. Set GEMINI_API_KEY in backend/.env and restart the server.'
      });
    }

    filePath = req.file.path;
    const { reportType = 'other' } = req.body;

    const report = await Report.create({
      user: req.user._id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype.includes('pdf') ? 'pdf' : 'image',
      filePath: req.file.filename,
      reportType,
      status: 'processing'
    });

    res.status(202).json({
      success: true,
      message: 'Report uploaded. AI analysis in progress.',
      report
    });

    const mimetype =
      req.file.mimetype === 'image/jpg' ? 'image/jpeg' : req.file.mimetype;

    setImmediate(() => {
      processReportAnalysis(report._id, {
        filePath,
        mimetype,
        originalname: req.file.originalname
      });
    });
  } catch (error) {
    console.error('Upload report error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload report.'
    });
  }
};

const getUserReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Report.countDocuments({ user: req.user._id });
    const reports = await Report.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-extractedText -analysis.ragContext');

    res.json({
      success: true,
      reports,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports.' });
  }
};

const getReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    res.json({ success: true, report });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch report.' });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    if (report.filePath) {
      const fullPath = path.join(__dirname, '../uploads', report.filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await report.deleteOne();
    if (report.status === 'completed') {
      await User.findByIdAndUpdate(req.user._id, { $inc: { reportsCount: -1 } });
    }

    res.json({ success: true, message: 'Report deleted successfully.' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete report.' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const total = await Report.countDocuments({ user: req.user._id });
    const completed = await Report.countDocuments({ user: req.user._id, status: 'completed' });
    const recent = await Report.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fileName reportType status createdAt analysis.summary analysis.reportType errorMessage');

    const byType = await Report.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$reportType', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: { total, completed, recentReports: recent, byType }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};

module.exports = {
  uploadReport,
  getUserReports,
  getReport,
  deleteReport,
  getDashboardStats,
  processReportAnalysis
};
