const express = require('express');
const mongoose = require('mongoose');

const app = express();
const setRoutes = require('./src/routes/v1.js');
require('dotenv').config();

// Agrego prefijo de version

setRoutes(app);

const { APP_PORT, DB_HOST, DB_DATABASE } = process.env;

mongoose
  .connect(`mongodb://${DB_HOST}/${DB_DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database ready');
    setRoutes(app);
    app.listen(APP_PORT, () => {
      console.log(`Listening on port ${APP_PORT}`);
    });
  })
  .catch(error => {
    console.error(error);

    mongoose.connection.close();
  });
