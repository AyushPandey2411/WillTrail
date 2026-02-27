const crypto   = require('crypto');
const Directive = require('../models/Directive');
const User      = require('../models/User');
const { generateQRCode }    = require('../utils/qrGenerator');
const { generateDirectivePDF } = require('../utils/pdfGenerator');

// Compute profile completeness and update User.profileScore
const updateProfileScore = async (userId, directive) => {
  const s = directive.completionSteps;
  const filled = Object.values(s).filter(Boolean).length;
  const total  = Object.keys(s).length;
  const score  = Math.round((filled / total) * 100);
  await User.findByIdAndUpdate(userId, { profileScore: score });
};

const getDirective = async (req, res) => {
  try {
    let d = await Directive.findOne({ user: req.user._id });
    if (!d) d = await Directive.create({ user: req.user._id });
    res.json(d);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateDirective = async (req, res) => {
  try {
    const { personalInfo, emergencyContacts, medicalInfo, carePreferences, healthcareAgent, publicFields } = req.body;

    const completionSteps = {
      personalInfo:      !!(personalInfo?.fullName),
      emergencyContacts: (emergencyContacts?.filter(c => c.name && c.phone).length > 0),
      medicalInfo:       (medicalInfo?.allergies?.length > 0 || medicalInfo?.conditions?.length > 0),
      carePreferences:   !!(carePreferences?.cprPreference),
      healthcareAgent:   !!(healthcareAgent?.name),
    };

    const d = await Directive.findOneAndUpdate(
      { user: req.user._id },
      { personalInfo, emergencyContacts, medicalInfo, carePreferences, healthcareAgent, publicFields, completionSteps },
      { new: true, upsert: true, runValidators: true }
    );

    await updateProfileScore(req.user._id, d);
    res.json(d);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const getEmergencyCard = async (req, res) => {
  try {
    const user = await User.findOne({
      emergencyCardToken: req.params.token,
      emergencyCardTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(404).json({ message: 'Emergency card not found or expired' });

    const d = await Directive.findOne({ user: user._id });
    if (!d)   return res.status(404).json({ message: 'No directive found' });

    const pf   = d.publicFields;
    const card = {
      name:              d.personalInfo?.fullName,
      bloodType:         pf.showBloodType         ? d.personalInfo?.bloodType          : undefined,
      allergies:         pf.showAllergies          ? d.medicalInfo?.allergies           : undefined,
      conditions:        pf.showConditions         ? d.medicalInfo?.conditions          : undefined,
      medications:       pf.showMedications        ? d.medicalInfo?.medications         : undefined,
      emergencyContacts: pf.showEmergencyContacts  ? d.emergencyContacts                : undefined,
      cprPreference:     pf.showCPRPreference      ? d.carePreferences?.cprPreference   : undefined,
      healthcareAgent:   pf.showHealthcareAgent    ? d.healthcareAgent                  : undefined,
      physician:         pf.showPhysician          ? d.medicalInfo?.physician           : undefined,
    };
    Object.keys(card).forEach(k => card[k] === undefined && delete card[k]);
    res.json(card);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const generateQR = async (req, res) => {
  try {
    const token  = crypto.randomBytes(24).toString('hex');
    const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await User.findByIdAndUpdate(req.user._id, { emergencyCardToken: token, emergencyCardTokenExpiry: expiry });

    const cardUrl   = `${process.env.FRONTEND_URL}/emergency-card/${token}`;
    const qrDataUrl = await generateQRCode(cardUrl);
    res.json({ qrDataUrl, cardUrl, token, expiry });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const downloadPDF = async (req, res) => {
  try {
    const d = await Directive.findOne({ user: req.user._id });
    if (!d) return res.status(404).json({ message: 'Please complete your directive first' });

    const buf = await generateDirectivePDF(d, req.user);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="WillTrail_${Date.now()}.pdf"`,
      'Content-Length': buf.length,
    });
    res.send(buf);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getDirective, updateDirective, getEmergencyCard, generateQR, downloadPDF };
