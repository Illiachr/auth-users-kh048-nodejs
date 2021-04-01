const users = require('../models/users.model');
const passwordUtils = require('../_helpers/password.utils');

const signIn = async (req, res, next) => {
  let resStatus = 500;
  try {
    const { login, password } = req.body;
    const resUserToCheck = await users.getUserByLogin(login);
    const user = resUserToCheck.rows[0];
    const { id, hash, salt } = user;
    if (!passwordUtils.valid(password, hash, salt)) {
      resStatus = 400;
      return res.status(resStatus).send({ error: 'Login or password is incorrect' });
    };
    const resUserToJWT = await users.getUserJoin(id);
    res.send(resUserToJWT.rows[0]);
  } catch (err) {
    res.status(resStatus).send(err);
  }
};

const signUp = async (req, res, next) => {
  try {
    const result = await users.addUser(req.body);
    const id = result.rows[0].id;
    res.send(id);
  } catch (err) {
    err.code === '23505'
      ? res.status(409).send({ error: 'Login already exists' })
      : res.send({ err });
  }
};

module.exports = { signUp, signIn };
