require('dotenv').config();
const express = require('express');

const { json } = require('body-parser');
const { sign, decode } = require('jsonwebtoken');
const { compare, hash } = require('bcrypt');
const jwt = require('express-jwt');

const User = require('../models/user.model');
const Contact = require('../models/contact.model');

const { JWT_SECRET } = process.env;

module.exports = app => {
  const router = express.Router();

  // CreateUser
  router.post('/users', json(), async (req, res) => {
    const userBody = req.body;

    try {
      const hashed = await hash(userBody.password, 10);
      const newUser = await User.create({
        name: userBody.name,
        email: userBody.email,
        password: hashed,
      });
      const token = await sign({}, JWT_SECRET);
      res.status(202).json({
        user: newUser,
        token,
      });
    } catch (ex) {
      if (ex.code === 11000) {
        res.status(401).json({
          message: `The username with email ${ex.keyValue.email} alredy exists.`,
        });
      }
      res.status(500).json({ ex });
    }
  });

  // Login
  router.post('/sessions', json(), async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    try {
      const login = await compare(password, userDoc.password);

      if (!login) {
        res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = sign({ email }, JWT_SECRET);
      res.status(200).json({
        user: email,
        token,
      });
    } catch (ex) {
      res.status(500).json({ message: 'An error has ocurred' });
    }
  });

  // List contact numbers
  router.get(
    '/contacts',
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
        docs: 'contacts',
        totalDocs: 'totalContacts',
      };

      const paginationOptions = {
        page,
        limit: 10,
        customLabels,
        select: '_ID name phone',
        sort: 'name',
      };

      try {
        const contacts = await Contact.paginate({}, paginationOptions);
        res.status(200).json(contacts);
      } catch (ex) {
        res.status(500).json({ ex });
      }
    }
  );

  // List contact numbers
  router.get(
    '/contacts/:contactId',
    jwt({ secret: JWT_SECRET }),
    json(),
    async (req, res) => {
      const { contactId } = req.params;
      try {
        const contact = await Contact.findById(contactId);
        res.status(200).json(contact);
      } catch (ex) {
        console.log({ ex });
        res.status(400).json({ message: 'Contact not found' });
      }
    }
  );

  // Create number
  router.post(
    '/contacts',
    jwt({ secret: JWT_SECRET }),
    json(),
    async (req, res) => {
      const auth = req.get('Authorization');
      const { username } = decode(auth.split(' ')[1], JWT_SECRET); // bearer token

      const { name, phone } = req.body;
      if (!name) {
        res.status(400).send('name parameter is required');
      }
      if (!phone) {
        res.status(400).send('phone parameter is required');
      }

      const existingUser = await User.findOne({ email: username });
      if (
        typeof existingUser === 'undefined' ||
        typeof existingUser._id === 'undefined'
      ) {
        res.status(401).json({
          message: `The username with email ${username} was not found.`,
        });
      }
      const newContact = await Contact.create({
        user: existingUser._id,
        name,
        phone,
      });

      res.status(201).json({ newContact });
    }
  );

  app.use('/v1', router);
};
