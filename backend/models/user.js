// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'] },
});

module.exports = mongoose.model('User', UserSchema);
