const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');
const auth = require('../middleware/auth');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Create product
router.post('/create', auth, upload.single('image'), async (req, res) => {
  console.log('Create product body:', req.body, 'File:', req.file); // Debug
  const { title, description, price, category } = req.body;
  try {
    if (!title || !description || !price || !category || !req.file) {
      return res.status(400).json({ msg: 'All fields and image are required' });
    }
    const product = new Product({
      title,
      description,
      price: parseFloat(price),
      category,
      image: req.file.path,
      seller: req.user,
    });
    await product.save();
    res.json(product);
  } catch (err) {
    console.log('Create product error:', err.message); // Debug
    res.status(500).json({ msg: 'Server error' });
  }
});

// List all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.json(products);
  } catch (err) {
    console.log('List products error:', err.message); // Debug
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.log('Get product error:', err.message); // Debug
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update product (seller only)
router.put('/:id', auth, async (req, res) => {
  const { title, description, price, category } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.seller.toString() !== req.user) {
      return res.status(403).json({ msg: 'Not authorized to update this product' });
    }
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price ? parseFloat(price) : product.price;
    product.category = category || product.category;
    await product.save();
    res.json(product);
  } catch (err) {
    console.log('Update product error:', err.message); // Debug
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete product (seller only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.seller.toString() !== req.user) {
      return res.status(403).json({ msg: 'Not authorized to delete this product' });
    }
    await product.deleteOne();
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    console.log('Delete product error:', err.message); // Debug
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;