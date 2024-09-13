// backend/models/Book.js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  available: Boolean,
});

module.exports = mongoose.model('Book', BookSchema);
