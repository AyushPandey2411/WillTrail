const { trackEvent } = require('../utils/analytics');

/**
 * Auto-track key API events after successful responses.
 * Non-blocking — never affects response time.
 */
const autoTrack = (req, res, next) => {
  res.on('finish', () => {
    const { method, path } = req;
    const status = res.statusCode;
    if (status >= 400) return; // only track successes

    const map = {
      'POST /api/auth/register': 'user.register',
      'POST /api/auth/login':    'user.login',
      'PUT /api/directive':      'directive.save',
      'POST /api/documents':     'document.upload',
      'POST /api/directive/generate-qr': 'qr.generate',
      'GET /api/directive/pdf':  'pdf.download',
    };

    const key   = `${method} ${path}`;
    const event = map[key];
    if (event) trackEvent(event);
  });
  next();
};

module.exports = { autoTrack };
