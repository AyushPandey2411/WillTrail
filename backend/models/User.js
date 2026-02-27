const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true,
             match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, required: true, minlength: 8, select: false },

    // RBAC
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },

    // Account state
    isActive:    { type: Boolean, default: true },
    isVerified:  { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    loginCount:  { type: Number, default: 0 },

    // Emergency card
    emergencyCardToken:  { type: String, unique: true, sparse: true },
    emergencyCardTokenExpiry: { type: Date },

    // Profile completeness (0-100)
    profileScore: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ emergencyCardToken: 1 }, { sparse: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Strip sensitive fields from JSON output
userSchema.methods.toPublicJSON = function () {
  return {
    id:          this._id,
    name:        this.name,
    email:       this.email,
    role:        this.role,
    isVerified:  this.isVerified,
    profileScore: this.profileScore,
    createdAt:   this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
