const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName:  { type: String, required: true },
    mimeType:      { type: String, required: true },
    sizeBytes:     { type: Number, required: true },
    encryptedData: { type: String, required: true },
    category: {
      type: String,
      enum: ['Insurance','Test Results','Prescription','Imaging','Legal','Other'],
      default: 'Other',
    },
    notes: { type: String, maxlength: 500 },
    tags:  [String],
  },
  { timestamps: true }
);

documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Document', documentSchema);
