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

const changePassword = async (req, res, next) => {
  const { password, newPassword } = req.body;
  const id = req.params.id;
  await service.changePassword(id, password, newPassword, res);
  next();
};

const changeRole = async (req, res, next) => {
  // eslint-disable-next-line camelcase
  const { role_id } = req.body;
  const id = req.params.id;
  await service.changeRole(id, role_id, res);
  next();
};

module.exports = {
  signUp,
  signIn,
  changePassword,
  changeRole
};
