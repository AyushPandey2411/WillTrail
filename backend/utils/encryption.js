const crypto = require('crypto');

const ALGORITHM  = 'aes-256-cbc';
const KEY_LENGTH = 32;
const IV_LENGTH  = 16;

const getKey = () =>
  crypto.scryptSync(process.env.ENCRYPTION_KEY || 'dev_fallback_key', 'willtrail_v2_salt', KEY_LENGTH);

const encrypt = (data) => {
  const iv     = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const input  = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  const enc    = Buffer.concat([cipher.update(input), cipher.final()]);
  return `${iv.toString('hex')}:${enc.toString('hex')}`;
};

const decrypt = (str) => {
  const [ivHex, encHex] = str.split(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(encHex, 'hex')), decipher.final()]);
};

module.exports = { encrypt, decrypt };
