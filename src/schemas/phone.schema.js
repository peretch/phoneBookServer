const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { User } = require('../models');

const PhoneSchema = new mongoose.Schema(
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
    number: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

PhoneSchema.plugin(mongoosePaginate);

module.exports = PhoneSchema;
