const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

async function migrateCategory() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    
    const result = await Product.updateMany(
      { category: 'Common' },
      { $set: { category: 'General' } }
    );
    
    console.log(`Updated ${result.modifiedCount} products from Common to General`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateCategory();
