const router = require('express').Router();
const { uploadDocument, getDocuments, downloadDocument, deleteDocument } =
  require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.use(protect);
router.post('/',                    upload.single('file'), uploadDocument);
router.get('/',                     getDocuments);
router.get('/:id/download',         downloadDocument);
router.delete('/:id',               deleteDocument);

module.exports = router;
