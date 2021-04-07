const pattern = {
  uid: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
  login: /^[a-z]{5,}([_-]?[a-z0-9]{1,20})$/g,
  pwd: /[aA-zZ0-9]{6,}/g,
  loginMinLen: 6,
  loginMaxLen: 20,
  pwdMinLen: 8
};

const testUID = uid => pattern.uid.test(uid);

const testLogin = login => {
  const len = login.length;
  if (len < pattern.loginMinLen || len > pattern.loginMaxLen) {
    return false;
  }
  return pattern.login.test(login);
};

const testPwd = password => pattern.pwd.test(password);

module.exports = { testUID, testLogin, testPwd };
