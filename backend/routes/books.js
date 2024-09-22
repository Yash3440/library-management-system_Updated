const express = require('express');
   const router = express.Router();
   const Book = require('../models/Book');
   const authMiddleware = require('../middleware/auth');

   // Get all books (no auth required)
   router.get('/', async (req, res) => {
     try {
       const books = await Book.find();
       res.json(books);
     } catch (err) {
       res.status(500).json({ message: err.message });
     }
   });

   // Add a new book (auth required)
   router.post('/', authMiddleware, async (req, res) => {
     const book = new Book(req.body);
     try {
       const newBook = await book.save();
       res.status(201).json(newBook);
     } catch (err) {
       res.status(400).json({ message: err.message });
     }
   });

   // Update a book (auth required)
   router.put('/:id', authMiddleware, async (req, res) => {
     try {
       const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
       if (!book) return res.status(404).json({ message: 'Book not found' });
       res.json(book);
     } catch (err) {
       res.status(400).json({ message: err.message });
     }
   });

   // Delete a book (auth required)
   router.delete('/:id', authMiddleware, async (req, res) => {
     try {
       const book = await Book.findByIdAndDelete(req.params.id);
       if (!book) return res.status(404).json({ message: 'Book not found' });
       res.json({ message: 'Book deleted' });
     } catch (err) {
       res.status(400).json({ message: err.message });
     }
   });

   module.exports = router;