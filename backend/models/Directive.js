const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  relationship: { type: String, required: true },
  phone:        { type: String, required: true },
  email:        { type: String },
  isPrimary:    { type: Boolean, default: false },
});

const directiveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    personalInfo: {
      fullName:        String,
      dateOfBirth:     Date,
      bloodType:       { type: String, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown',''] },
      primaryLanguage: String,
      photoUrl:        String,
    },

    emergencyContacts: [emergencyContactSchema],

    medicalInfo: {
      conditions:  [String],
      medications: [String],
      allergies:   [String],
      physician: { name: String, phone: String, clinic: String },
    },

    carePreferences: {
      cprPreference:         { type: String, enum: ['Full resuscitation','DNR','Comfort care only',''] },
      mechanicalVentilation: { type: String, enum: ['Yes','No','Limited trial',''] },
      artificialNutrition:   { type: String, enum: ['Yes','No','Limited trial',''] },
      organDonation:         { type: Boolean, default: false },
      additionalWishes:      { type: String, maxlength: 2000 },
    },

    healthcareAgent: { name: String, relationship: String, phone: String, email: String },

    publicFields: {
      showBloodType:         { type: Boolean, default: true  },
      showAllergies:         { type: Boolean, default: true  },
      showConditions:        { type: Boolean, default: false },
      showMedications:       { type: Boolean, default: false },
      showEmergencyContacts: { type: Boolean, default: true  },
      showCPRPreference:     { type: Boolean, default: true  },
      showHealthcareAgent:   { type: Boolean, default: true  },
      showPhysician:         { type: Boolean, default: false },
    },

    completionSteps: {
      personalInfo:      { type: Boolean, default: false },
      emergencyContacts: { type: Boolean, default: false },
      medicalInfo:       { type: Boolean, default: false },
      carePreferences:   { type: Boolean, default: false },
      healthcareAgent:   { type: Boolean, default: false },
    },

    isComplete:   { type: Boolean, default: false },
    lastEditedAt: { type: Date },
  },
  { timestamps: true }
);

directiveSchema.index({ user: 1 });

// Auto-calculate completion before save
directiveSchema.pre('save', function (next) {
  const s = this.completionSteps;
  const filled = Object.values(s).filter(Boolean).length;
  this.isComplete = filled === Object.keys(s).length;
  this.lastEditedAt = new Date();
  next();
});

module.exports = mongoose.model('Directive', directiveSchema);
