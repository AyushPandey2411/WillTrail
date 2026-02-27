const multer = require('multer');

const ALLOWED = ['application/pdf','image/jpeg','image/png','image/webp',
                 'application/msword',
                 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    ALLOWED.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('File type not allowed. Accepted: PDF, JPEG, PNG, WEBP, DOC, DOCX'));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
