const mongoose = require('mongoose');
const PhoneSchema = require('../schemas/phone.schema');

module.exports = mongoose.model('Phone', PhoneSchema);
