const users = require('../models/users.model');

const getAll = (req, res) => {
  console.log(users);
  res.send({ msg: 'Lets get all users form DB' });
};

const sigUpHandler = (req, res) => res.send(req.body);

module.exports = { sigUpHandler, getAll };
