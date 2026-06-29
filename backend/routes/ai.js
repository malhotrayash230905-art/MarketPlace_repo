const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { generateDescription, verifyItemImage } = require('../utils/gemini');
const { moderateText } = require('../utils/groq');

// @route   POST api/ai/generate-description
// @desc    Generate product description using Gemini
// @access  Private
router.post('/generate-description', auth, async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    console.log(`[POST /generate-description] Received request for title: "${title}"`);
    console.log(`[POST /generate-description] Image URL length: ${imageUrl ? imageUrl.length : 0}`);
    
    if (!title) return res.status(400).json({ msg: 'Title is required' });
    if (!imageUrl) return res.status(400).json({ msg: 'Image is required' });
    
    const description = await generateDescription(title, imageUrl);
    console.log(`[POST /generate-description] Success! Returning description length: ${description.length}`);
    res.json({ description });
  } catch (err) {
    console.error("[POST /generate-description] Server Error:", err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   POST api/ai/verify-image
// @desc    Verify image matches title and quality using Gemini
// @access  Private
router.post('/verify-image', auth, async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title || !imageUrl) return res.status(400).json({ msg: 'Title and Image URL required' });
    
    const status = await verifyItemImage(title, imageUrl);
    res.json({ isValid: status === 'VALID' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ai/verify-text
// @desc    Moderate description text using Llama via Groq
// @access  Private
router.post('/verify-text', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Text is required' });
    
    const result = await moderateText(text);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
