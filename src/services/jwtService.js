require('dotenv').config();

const { sign, decode } = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const createToken = async ({ email }) => {
  const token = await sign({ email }, JWT_SECRET);
  return token;
};

module.exports = {
  createToken,
};
