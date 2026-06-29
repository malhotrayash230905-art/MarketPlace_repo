const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Mens', 'Womens', 'General'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isSold: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Product', productSchema);
