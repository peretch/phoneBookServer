require('dotenv').config();

const { compare, hash } = require('bcrypt');
const { createToken } = require('./jwtService');

const User = require('../models/user.model');

const searchUserByEmail = async ({ email }) => {
  const existingUser = await User.findOne({ email });
  return existingUser;
};

const createUser = async ({ email, password }) => {
  const hashed = await hash(password, 10);
  const user = await User.create({
    email,
    password: hashed,
  });
  const token = await createToken({ email });
  return { user, token };
};

const authenticateUser = async ({ email, password }) => {
  const user = await searchUserByEmail({ email });
  if (!user) {
    return false;
  }
  const authenticated = await compare(password, user.password);
  return authenticated;
};

const recoveryPassword = async ({ email }) => {
  console.log('Not implemented');
};

module.exports = {
  searchUserByEmail,
  createUser,
  authenticateUser,
  recoveryPassword,
};
