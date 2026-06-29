const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware');

// @route   POST api/payment/create-order
// @desc    Create a razorpay order for a product
// @access  Private
router.post('/create-order', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    if (product.isSold) {
      return res.status(400).json({ msg: 'Product is already sold' });
    }

    // Razorpay amount is in paise (1 INR = 100 paise)
    const options = {
      amount: product.price * 100,
      currency: "INR",
      receipt: `rcpt_${product._id.toString().slice(-10)}_${Date.now().toString().slice(-6)}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      product: {
        _id: product._id,
        title: product.title,
        price: product.price,
        sellerId: product.sellerId
      }
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/payment/verify
// @desc    Verify razorpay payment signature and create Order record
// @access  Private
router.post('/verify', auth, async (req, res) => {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      productId,
      amount,
      sellerId
    } = req.body;

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ msg: 'Payment verification failed' });
    }

    // Payment is valid, create Order record
    const newOrder = new Order({
      buyerId: req.user.id,
      sellerId,
      productId,
      amount: amount / 100, // convert back to INR
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: 'SUCCESS'
    });

    await newOrder.save();

    // Mark product as sold
    const product = await Product.findById(productId);
    if (product) {
      if (product.quantity <= 1) {
        product.isSold = true;
      } else {
        product.quantity -= 1;
      }
      await product.save();
    }

    res.json({ 
      msg: 'Payment successful', 
      order: newOrder 
    });

  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payment/my-orders
// @desc    Get items bought by the user
// @access  Private
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id })
      .populate('productId', 'title imageUrl description category contactNumber')
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payment/my-sales
// @desc    Get items sold by the user
// @access  Private
router.get('/my-sales', auth, async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user.id, paymentStatus: 'SUCCESS' })
      .populate('productId', 'title imageUrl')
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
