const { v4: uuid } = require('uuid');
const crypto = require('crypto');
const { Pool } = require('pg');

class Users {
  constructor() {
    this.db = process.env.DB_NAME;
    this.usersTable = process.env.DB_USERS_TABLE;
    this.rolesTable = process.env.DB_ROLE_TABLE;
  }

  init() {
    this.pool = new Pool({
      user: 'postgres',
      password: 'postgres',
      host: 'localhost',
      port: 5432,
      database: this.db
    });
  }

  setUserId() {
    return uuid();
  }

  // Method to set salt and hash the password for a user
  setPassword(password) {
    // Creating a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations,

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  };

  // Method to check the entered password is correct or not
  validPassword(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
  };
}

const users = new Users();
users.init();

module.exports = users;
