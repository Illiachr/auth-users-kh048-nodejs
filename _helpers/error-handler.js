const errorHandler = (err, req, res, next) => {
  if (typeof err === 'string') {
    // custom application error
    return res.status(400).send({ message: err });
  }

  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).send({ message: 'Invalid token' });
  }

  // default to 500 server error
  return res.status(500).send({ message: err.message });
};

module.exports = errorHandler;
