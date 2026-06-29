const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Activity = require('../models/Activity');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

// @route   POST api/products
// @desc    Create a product listing
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, quantity, contactNumber } = req.body;
    
    // In actual implementation, image URL will come from req.file.path via Cloudinary
    // But we'll accept imageUrl in body if provided for testing
    let imageUrl = req.body.imageUrl || '';
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    if (!imageUrl) {
      return res.status(400).json({ msg: 'Image is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      quantity,
      contactNumber,
      imageUrl,
      sellerId: req.user.id,
      collegeId: user.collegeId
    });

    const product = await newProduct.save();

    // Increment user's lifetime listings count
    await User.findByIdAndUpdate(req.user.id, { $inc: { totalListings: 1 } });

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/category/:category
// @desc    Get all products by category with optional price filter
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    // Capitalize category properly: "mens" -> "Mens"
    const cat = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1);
    
    const { minPrice, maxPrice, collegeId } = req.query;
    let query = { category: cat, isSold: { $ne: true } };

    if (collegeId) {
      query.collegeId = collegeId;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/products/:id/view
// @desc    Track user viewing a product modal
// @access  Private
router.post('/:id/view', auth, async (req, res) => {
  try {
    const newActivity = new Activity({
      userId: req.user.id,
      productId: req.params.id,
      action: 'view'
    });
    await newActivity.save();
    res.json({ msg: 'Activity logged' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   GET api/products/latest
// @desc    Get the most recent products for the homepage
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    const { collegeId } = req.query;
    let query = { isSold: { $ne: true } };
    if (collegeId) {
      query.collegeId = collegeId;
    }
    const products = await Product.find(query).sort({ createdAt: -1 }).limit(10);
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/my-listings
// @desc    Get listings created by the logged-in user
// @access  Private
router.get('/my-listings', auth, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a listing
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Verify user owns the product
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
