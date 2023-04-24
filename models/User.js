const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

module.exports = mongoose.model('User', userSchema);
