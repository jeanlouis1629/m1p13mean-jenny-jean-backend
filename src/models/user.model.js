const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['ADMIN', 'SHOP', 'USER'],
    default: 'USER'
  },
  actif: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema, 'User');