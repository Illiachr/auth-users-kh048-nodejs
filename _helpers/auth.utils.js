const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

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

const authorize = (roles = []) => {
  const secret = process.env.JWT_SECRET;

  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])

  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to requset object (req.user)
    expressJwt({
      secret,
      algorithms: ['HS256']
    }),

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return res.status(401).send({ error: 'Unauthorized' });
      }

      //  authentication and authorization successful
      next();
    }
  ];
};

module.exports = { valid, createToken, authorize };
