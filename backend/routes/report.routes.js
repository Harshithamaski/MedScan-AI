const express = require('express');
const router = express.Router();
const { uploadReport, getUserReports, getReport, deleteReport, getDashboardStats } = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

router.use(protect);

router.post('/upload', (req, res, next) => {
  upload.single('report')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed.'
      });
    }
    next();
  });
}, uploadReport);
router.get('/', getUserReports);
router.get('/dashboard-stats', getDashboardStats);
router.get('/:id', getReport);
router.delete('/:id', deleteReport);

module.exports = router;
