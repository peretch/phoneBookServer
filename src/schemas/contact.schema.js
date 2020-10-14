const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { User } = require('../models');

const ContactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      validate: {
        validator: userId => User.findById(userId),
        message: 'El usuario ingresado no existe',
      },
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    lastname: {
      type: mongoose.Schema.Types.String,
    },
    phone: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.plugin(mongoosePaginate);

module.exports = ContactSchema;
