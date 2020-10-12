require('dotenv').config();
const express = require('express');

const { json } = require('body-parser');
const { sign, decode } = require('jsonwebtoken');
const { compare, hash } = require('bcrypt');
const jwt = require('express-jwt');

const User = require('../models/user.model');
const Phone = require('../models/phone.model');

const { JWT_SECRET } = process.env;

module.exports = app => {
  const router = express.Router();

  // CreateUser
  router.post('/users', json(), (req, res) => {
    const userBody = req.body;
    hash(userBody.password, 10)
      .then(hashed =>
        User.create({
          name: userBody.name,
          email: userBody.email,
          password: hashed,
        })
      )
      .then(newUser => {
        const token = sign({}, JWT_SECRET);
        res.status(201).json({
          user: newUser,
          token,
        });
      })
      .catch(error => {
        if (error.code === 11000) {
          res.status(401).json({
            message: `The username with email ${error.keyValue.email} alredy exists.`,
          });
        }
        res.status(500).json({
          error,
        });
      });
  });

  // Login
  router.post('/sessions', json(), (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
      .then(userDoc =>
        Promise.all([userDoc, compare(password, userDoc.password)])
      )
      .then(([{ email: username }]) => {
        const token = sign({ username }, JWT_SECRET);
        res.status(200).json({
          user: email,
          token,
        });
      })
      .catch(error => {
        res.status(400).json({
          error: error.message,
        });
      });
  });

  // List phone numbers
  router.get(
    '/phones',
    jwt({ secret: JWT_SECRET }),
    json(),
    async (req, res) => {
      let { page } = req.body;

      if (typeof page !== 'undefined' && typeof page !== 'number') {
        res.status(400).json('The page attribute must be of type number.');
      }

      if (typeof page === 'undefined') {
        page = 1;
      }

      const customLabels = {
        docs: 'phones',
        totalDocs: 'totalPhones',
      };

      const paginationOptions = {
        page,
        limit: 10,
        customLabels,
      };

      const phones = await Phone.paginate({}, paginationOptions);
      res.status(200).json(phones);
    }
  );

  // Create number
  router.post(
    '/phones',
    jwt({ secret: JWT_SECRET }),
    json(),
    async (req, res) => {
      const auth = req.get('Authorization');
      const { username } = decode(auth.split(' ')[1], JWT_SECRET); // bearer token

      const existingUser = await User.findOne({ email: username });
      if (
        typeof existingUser === 'undefined' ||
        typeof existingUser._id === 'undefined'
      ) {
        res.status(401).json({
          message: `The username with email ${username} was not found.`,
        });
      }

      const { number } = req.body;
      const newPhone = await Phone.create({ user: existingUser._id, number });

      res.status(201).json({ newPhone });
    }
  );

  app.use('/v1', router);
};
