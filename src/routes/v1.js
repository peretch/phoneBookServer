require('dotenv').config();

const express = require('express');

const { decode } = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

/**
 * Middlewares
 */
const cors = require('cors');
const jwt = require('express-jwt');
const { json } = require('body-parser');
const allowedMethods = require('../middlewares/allowedMethods');

/**
 * Services
 */
const {
  searchUserByEmail,
  createUser,
  authenticateUser,
  recoveryPassword,
} = require('../services/userService');

const {
  createContact,
  deleteContact,
  searchContacts,
  findContactById,
} = require('../services/contactService');

const { createToken } = require('../services/jwtService');

module.exports = app => {
  const router = express.Router();

  // To avoid HTTP errors in my environment
  router.use(cors());

  // Handling allowed methods for each endpoint
  router.all('/users', allowedMethods(['POST']));
  router.all('/sessions', allowedMethods(['POST']));
  router.all('/contacts', allowedMethods(['GET', 'POST']));
  router.all('/contacts/:contactId', allowedMethods(['GET', 'DELETE']));

  // CreateUser
  router.post('/users', json(), async (req, res) => {
    const { email, password } = req.body;
    try {
      const { user, token } = await createUser({ email, password });
      res.status(202).json({
        email: user.email,
        token,
      });
    } catch (ex) {
      if (ex.code === 11000) {
        res.status(401).json({
          message: `The username with email ${ex.keyValue.email} alredy exists.`,
        });
      }
      res.status(400).json({ error: ex });
    }
  });

  // Login
  router.post('/sessions', json(), async (req, res) => {
    const { email, password } = req.body;
    try {
      const login = await authenticateUser({ email, password });

      if (!login) {
        res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = await createToken({ email });
      res.status(200).json({
        email,
        token,
      });
    } catch (ex) {
      res.status(500).json({ message: 'An error has ocurred' });
    }
  });

  router.post('/users/recovery', json(), async (req, res) => {
    const { email } = req.body;
    const existingUser = await searchUserByEmail({ email });
    if (!existingUser) {
      res.status(401).json({
        message: `The username with email ${email} was not found.`,
      });
    }
    const ok = await recoveryPassword({ email });
    if (!ok) {
      res.status(500).json({ ok });
    }
    res.status(200).json({ ok });
  });

  // List contact numbers
  router.get(
    '/contacts',
    jwt({ secret: JWT_SECRET }),
    json(),
    async (req, res) => {
      const auth = req.get('Authorization');
      const { email } = decode(auth.split(' ')[1], JWT_SECRET); // bearer token
      const existingUser = await searchUserByEmail({ email });

      if (!existingUser) {
        res.status(401).json({
          message: `The username with email ${email} was not found.`,
        });
      }

      // let { page, name, phone } = req.query;
      const { name, phone } = req.query;

      // if (typeof page === 'undefined') {
      //   page = 1;
      // }

      let filters = {};
      if (name) {
        filters = {
          ...filters,
          name,
        };
      }
      if (phone) {
        filters = {
          ...filters,
          phone,
        };
      }

      try {
        const contacts = await searchContacts({
          user: existingUser._id,
          filters,
        });
        // const contacts = await searchContactsPaginated({
        //   user: existingUser._id,
        //   filters,
        //   page,
        // });
        res.status(200).json(contacts);
      } catch (ex) {
        res.status(500).json({ ex });
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
      const { email } = decode(auth.split(' ')[1], JWT_SECRET); // bearer token
      const existingUser = await searchUserByEmail({ email });
      if (!existingUser) {
        res.status(401).json({
          message: `The username with email ${email} was not found.`,
        });
      }

      const { name, lastname, phone } = req.body;

      if (!name || name.trim().length === 0) {
        res.status(400).json({ message: 'name parameter is required' });
      }
      if (!phone || phone.trim().length === 0) {
        res.status(400).json({ message: 'phone parameter is required' });
      }

      const newContact = await createContact({
        user: existingUser._id,
        name,
        lastname,
        phone,
      });

      res.status(202).json(newContact);
    }
  );

  // Find contact information
  router.get(
    '/contacts/:contactId',
    jwt({ secret: JWT_SECRET }),
    json(),
    async (req, res) => {
      const { contactId } = req.params;
      try {
        const contact = await findContactById({ contactId });
        if (contact === null) {
          res.status(404).send('Contact not found');
        }
        res.status(200).json(contact);
      } catch (ex) {
        res.status(404).send('Contact not found');
      }
    }
  );

  // Delete contact
  router.delete(
    '/contacts/:contactId',
    jwt({ secret: JWT_SECRET }),
    json(),
    async (req, res) => {
      const { contactId } = req.params;
      try {
        const existingUser = await findContactById({ contactId });
        if (existingUser === null) {
          res.status(404).send('Contact not found');
        }
        await deleteContact({ contactId });
        res.status(204).json({ message: 'Contact deleted' });
      } catch (ex) {
        res.status(404).send('Contact not found');
      }
    }
  );

  router.use((req, res, next) => {
    res
      .status(404)
      .json({ message: 'The URL you are looking for was not found :(' });
  });

  app.use('/api/v1', router);
};
