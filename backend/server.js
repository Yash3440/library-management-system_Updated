require('dotenv').config(); // Add this line at the top of your server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const mongoDBURI = process.env.MONGODB_URI; // Use the environment variable
mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
});

const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
