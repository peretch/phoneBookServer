require('dotenv').config();
const express = require('express');

const { json } = require('body-parser');
const { sign, decode } = require('jsonwebtoken');
const { compare, hash } = require('bcrypt');
const checkJwt = require('express-jwt');

const User = require('../models/user.model');

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

  app.use('/v1', router);
};
