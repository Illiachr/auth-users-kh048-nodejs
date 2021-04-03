const users = require('../models/users.model');
const authUtils = require('../_helpers/auth.utils');

const authorize = async (userId, res) => {
  const resUserToJWT = await users.getUserPayload(userId);
  const { id, role } = resUserToJWT.rows[0];
  return authUtils.createToken(id, role);
};

const signUp = async (body, res) => {
  try {
    const result = await users.addUser(body);
    const id = result.rows[0].id;
    const token = await authorize(id, res);
    res.send({ token });
  } catch (err) {
    err.code === '23505'
      ? res.status(409).send({ error: 'Login already exists' })
      : res.send({ error: err });
  }
};

const signIn = async (login, password, res) => {
  let resStatus = 500;
  try {
    const resUserToCheck = await users.getUserByLogin(login);
    const user = resUserToCheck.rows[0];
    const { id, hash, salt } = user;

    if (!authUtils.valid(password, hash, salt)) {
      resStatus = 400;
      return res.status(resStatus).send({ error: 'Login or password is incorrect' });
    };

    const token = await authorize(id, res);
    res.send({ token });
  } catch (err) {
    res.status(resStatus).send({ error: err });
  }
};

const changePassword = async (id, password, newPassword, res) => {
  let resStatus = 500;

  try {
    // eslint-disable-next-line no-use-before-define
    const resUserToCheck = await users.getUserById(id);
    const user = resUserToCheck.rows[0];
    if (!user) {
      resStatus = 404;
      return res.status(resStatus).send({ error: 'Such user don`t exist' });
    }
    const { hash, salt } = user;

    if (!authUtils.valid(password, hash, salt)) {
      resStatus = 400;
      return res.status(resStatus).send({ error: 'Old or password is incorrect' });
    };
    const resPasswordChange = await users.changePassword(id, newPassword);
    res.send(resPasswordChange.rows[0]);
  } catch (err) {
    res.status(resStatus).send({ error: err });
  }
};

const changeRole = async (id, roleId, res) => {
  let resStatus = 500;

  try {
    // eslint-disable-next-line no-use-before-define
    const resUserToCheck = await users.getUserById(id);
    const user = resUserToCheck.rows[0];
    if (!user) {
      resStatus = 404;
      return res.status(resStatus).send({ error: 'Such user don`t exist' });
    }

    const resRoleChange = await users.changeRole(id, roleId);
    res.send(resRoleChange.rows[0]);
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

module.exports = { signUp, signIn, changePassword, changeRole, getAll };
