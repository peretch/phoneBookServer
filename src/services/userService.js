require('dotenv').config();

const { compare, hash } = require('bcrypt');
const { createToken } = require('./jwtService');
const { sendEmail } = require('./mailerService');

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
  console.log('called recovery password');
  const newPassword =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);

  const hashed = await hash(newPassword, 10);

  const result = await User.update(
    { email },
    {
      password: hashed,
    }
  );

  console.log({ result });

  await sendEmail({
    from: 'webmaster@phonebookapp.com',
    to: email,
    subject: 'PhoneBook App - Recovery password',
    text: `Hey there! here is your new password for Phonebook App: ${newPassword}`,
  });
};

module.exports = {
  searchUserByEmail,
  createUser,
  authenticateUser,
  recoveryPassword,
};
