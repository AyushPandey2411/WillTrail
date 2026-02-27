const Document = require('../models/Document');
const { encrypt, decrypt } = require('../utils/encryption');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const doc = await Document.create({
      user:          req.user._id,
      originalName:  req.file.originalname,
      mimeType:      req.file.mimetype,
      sizeBytes:     req.file.size,
      encryptedData: encrypt(req.file.buffer),
      category:      req.body.category || 'Other',
      notes:         req.body.notes   || '',
      tags:          req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
    });

    res.status(201).json({
      _id: doc._id, originalName: doc.originalName, mimeType: doc.mimeType,
      sizeBytes: doc.sizeBytes, category: doc.category, notes: doc.notes,
      tags: doc.tags, createdAt: doc.createdAt,
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const getDocuments = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.category) filter.category = req.query.category;

    const docs = await Document.find(filter).select('-encryptedData').sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const buf = decrypt(doc.encryptedData);
    res.set({ 'Content-Type': doc.mimeType, 'Content-Disposition': `attachment; filename="${doc.originalName}"`, 'Content-Length': buf.length });
    res.send(buf);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json({ message: 'Document deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { uploadDocument, getDocuments, downloadDocument, deleteDocument };
