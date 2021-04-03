const service = require('../services/users.service');

const signIn = async (req, res, next) => {
  const { login, password } = req.body;
  await service.signIn(login, password, res);
  next();
};

const signUp = async (req, res, next) => {
  await service.signUp(req.body, res);
  next();
};

module.exports = { signUp, signIn };
