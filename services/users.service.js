const users = require('../models/users.model');
const authUtils = require('../_helpers/auth.utils');
const ROLE = require('../_helpers/role');
const { testPwd, testLogin } = require('../_helpers/validator');

const authorize = async (userId, res) => {
  const result = await users.getUserPayload(userId);
  const { id, role } = result.rows[0];
  return authUtils.createToken(id, role);
};

const userExists = (user, res) => {
  if (!user) {
    res.sendStatus(404);
    throw new Error('User not found');
  }
};

const checkLogin = async (login, res) => {
  if (!testLogin(login)) {
    res.status(400);
    throw new Error('Login is incorrect');
  }
  const resDb = await users.getUserByLogin(login);
  if (resDb.rows[0]) {
    res.status(409);
    throw new Error('Login already exists');
  }
};

const compareLogin = (login, newLogin, res) => {
  if (login !== newLogin) {
    res.status(500);
    throw new Error('Change login rejected');
  }
};

const checkPwd = (password, res) => {
  if (!testPwd(password)) {
    res.status(400);
    throw new Error('Password invalid');
  }
};

const checkAccess = (id, user, res) => {
  if (id !== user.sub && user.role !== ROLE.Admin) {
    res.status(403);
    throw new Error('Premission denided');
  }
};

const signUp = async (body, res) => {
  try {
    await checkLogin(body.login, res);
    checkPwd(body.password, res);
    const result = await users.addUser(body);
    const id = result.rows[0].id;
    const token = await authorize(id, res);
    res.send({ token });
  } catch (err) {
    err.code === '23505'
      ? res.status(409).send({ error: 'Login already exists' })
      : res.status(400).send({ error: err.message });
  }
};

const signIn = async (login, password, res, next) => {
  try {
    const resUserToCheck = await users.getUserByLogin(login);
    const user = resUserToCheck.rows[0];
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    const { id, hash, salt } = user;

    if (!authUtils.valid(password, hash, salt)) {
      res.status(400);
      throw new Error('Login or password is incorrect');
    };

    const token = await authorize(id, res);
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

const changeLogin = async (req, res, next) => {
  try {
    await checkLogin(req.body.newLogin, res);

    const { user: currentUser } = req;
    const { newLogin } = req.body;

    checkAccess(req.params.id, currentUser, res);

    let resDb = await users.getUserById(req.params.id);
    const user = resDb.rows[0];
    userExists(user, res);

    resDb = await users.changeLogin(user.id, newLogin);
    const { login } = resDb.rows[0];
    compareLogin(login, newLogin, res);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const changePassword = async (id, password, newPassword, res) => {
  let resStatus = 500;

  try {
    const resUserToCheck = await users.getUserById(id);
    const user = resUserToCheck.rows[0];
    if (!user) {
      resStatus = 404;
      return res.status(resStatus).send({ error: 'User not found' });
    }
    const { hash, salt } = user;

    if (!authUtils.valid(password, hash, salt)) {
      resStatus = 400;
      return res.status(resStatus).send({ error: 'oldPassword or password is incorrect' });
    };
    await users.changePassword(id, newPassword);
    res.sendStatus(204);
  } catch (err) {
    res.status(resStatus).send({ error: err });
  }
};

const changeRole = async (id, newRole, res) => {
  let resStatus = 500;

  try {
    const resUserToCheck = await users.getUserById(id);
    const user = resUserToCheck.rows[0];
    if (!user) {
      resStatus = 404;
      return res.status(resStatus).send({ error: 'User not found' });
    }
    const resRole = await users.getRole(newRole);
    const role = resRole.rows[0];
    if (!role) {
      resStatus = 404;
      return res.status(resStatus).send({ error: 'Role not found' });
    }
    await users.changeRole(id, role.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(resStatus).send({ error: err });
  }
};

const getAll = async (res) => {
  const resStatus = 500;
  try {
    const resUsers = await users.getAll();
    res.send(resUsers.rows);
  } catch (err) {
    res.status(resStatus).send({ error: err });
  }
};

module.exports = { signUp, signIn, changeLogin, changePassword, changeRole, getAll };
