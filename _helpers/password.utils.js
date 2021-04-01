const crypto = require('crypto');

// Method to check the entered password is correct or not
const valid = (password, hash, salt) => {
  const hashCheck = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === hashCheck;
};

module.exports = { valid };
