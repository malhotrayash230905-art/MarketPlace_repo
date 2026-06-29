const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const seedColleges = require('./utils/seedColleges');

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace')
.then(() => {
  console.log('MongoDB connected successfully');
  seedColleges();
})
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/payment', require('./routes/payment'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('AI Marketplace Backend API is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
