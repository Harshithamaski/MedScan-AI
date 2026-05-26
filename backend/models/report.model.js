const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true }, // pdf, image
  filePath: { type: String },
  reportType: {
    type: String,
    enum: ['prescription', 'blood_report', 'scan_report', 'other'],
    default: 'other'
  },
  extractedText: { type: String, default: '' },
  analysis: {
    summary: { type: String, default: '' },
    reportType: { type: String, default: '' },
    patientInfo: { type: Object, default: {} },
    diseases: [{ name: String, description: String, severity: String }],
    medicines: [{
      name: String,
      usage: String,
      dosage: String,
      sideEffects: String
    }],
    abnormalValues: [{
      parameter: String,
      value: String,
      normalRange: String,
      interpretation: String,
      severity: String
    }],
    precautions: [String],
    foodSuggestions: [String],
    lifestyleSuggestions: [String],
    seriousWarnings: [String],
    generalExplanation: { type: String, default: '' },
    doctorAdvice: { type: String, default: '' },
    ragContext: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  errorMessage: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
