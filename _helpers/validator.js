const pattern = {
  uid: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
  login: /^[a-z]{5,}([_-]?[a-z0-9]{1,20})$/,
  pwd: /[aA-zZ0-9]{6,}/
};

const testUID = uid => pattern.uid.test(uid);

const testLogin = login => pattern.login.test(login);

const testPwd = password => pattern.pwd.test(password);

module.exports = { testUID, testLogin, testPwd };
