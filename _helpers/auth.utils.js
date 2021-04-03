const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Method to check the entered password is correct or not
const valid = (password, hash, salt) => {
  const hashCheck = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === hashCheck;
};

// create a jwt token that is valid for 1 hour
const createToken = (userId, userRole, expiresIn = '1h') => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ sub: userId, role: userRole }, secret, { expiresIn });
};

module.exports = { valid, createToken };
