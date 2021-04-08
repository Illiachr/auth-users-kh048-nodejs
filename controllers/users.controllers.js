const service = require('../services/users.service');

const signIn = async (req, res, next) => {
  const { login, password } = req.body;
  await service.signIn(login, password, res, next);
  next();
};

const signUp = async (req, res, next) => {
  await service.signUp(req.body, res);
  next();
};

const changeLogin = async (req, res, next) => {
  await service.changeLogin(req, res, next);
};

const changePassword = async (req, res, next) => {
  const { password, newPassword } = req.body;
  const id = req.params.id;
  await service.changePassword(id, password, newPassword, res);
  next();
};

const changeRole = async (req, res, next) => {
  const { newRole } = req.body;
  const id = req.params.id;
  await service.changeRole(id, newRole, res);
  next();
};

const getAll = async (req, res, next) => {
  await service.getAll(res);
  next();
};

module.exports = {
  signUp,
  signIn,
  changeLogin,
  changePassword,
  changeRole,
  getAll
};
