require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Enhanced security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB connection
const mongoDBURI = process.env.MONGODB_URI;
mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
  process.exit(1);
});

// Routes
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});