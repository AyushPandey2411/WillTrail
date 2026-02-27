const QRCode = require('qrcode');

const generateQRCode = (url) =>
  QRCode.toDataURL(url, {
    width: 300, margin: 2,
    color: { dark: '#0f172a', light: '#ffffff' },
    errorCorrectionLevel: 'H',
  });

module.exports = { generateQRCode };
