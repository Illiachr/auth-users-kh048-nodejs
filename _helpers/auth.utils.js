const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Method to check the entered password is correct or not
const valid = (password, hash, salt) => {
  const hashCheck = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash === hashCheck;
};

// create a jwt token that is valid for 1 hour
const createToken = (userId, userRole, expiresIn = '1h') => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ sub: userId, role: userRole }, secret, { expiresIn });
};

function checkToken(roles = []) {
  const secret = process.env.JWT_SECRET;
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    (req, res, next) => {
      const token = req.headers['x-access-token'];
      if (!token) {
        return res.status(400).json({ message: 'x-access-token (jwt) must be provided' });
      }
      req.user = jwt.verify(token, secret);
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(401).json({ message: 'Don`t have permission' });
      }
      next();
    }
  ];
}

module.exports = { valid, createToken, checkToken };
