const router   = require('express').Router();
const { getDirective, updateDirective, getEmergencyCard, generateQR, downloadPDF } =
  require('../controllers/directiveController');
const { protect } = require('../middleware/authMiddleware');

router.get('/emergency-card/:token', getEmergencyCard); // Public

router.use(protect);
router.get('/',           getDirective);
router.put('/',           updateDirective);
router.post('/generate-qr', generateQR);
router.get('/pdf',        downloadPDF);

module.exports = router;
