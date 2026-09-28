const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// GET /api/products  (with optional ?search=&category=)
router.get('/', async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    const products = await Product.find(filter).sort('-createdAt');
    res.json(products);
  } catch (e) { next(e); }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (e) { next(e); }
});

// Admin routes
router.post('/', protect, admin, async (req, res, next) => {
  try { res.status(201).json(await Product.create(req.body)); }
  catch (e) { next(e); }
});

router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
