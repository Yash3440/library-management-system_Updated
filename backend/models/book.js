const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  available: { type: Boolean, default: true },
  isbn: { type: String, unique: true },
  publishedDate: Date,
  addedDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);