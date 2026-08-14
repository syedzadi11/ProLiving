const bcrypt = require('bcrypt');

const HASH_SALT = 10;

const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, HASH_SALT);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };