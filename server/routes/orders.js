const express = require('express');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders — create new order
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, shippingAddress, totalPrice } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No items' });
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalPrice,
      isPaid: true,         // mock payment
      paidAt: new Date(),
    });
    res.status(201).json(order);
  } catch (e) { next(e); }
});

// GET /api/orders/mine — current user orders
router.get('/mine', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (e) { next(e); }
});

// GET /api/orders — list all orders (admin only)
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (e) { next(e); }
});

// PUT /api/orders/:id/deliver — mark order as delivered (admin only)
router.put('/:id/deliver', protect, admin, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.isDelivered = !order.isDelivered;
    order.deliveredAt = order.isDelivered ? new Date() : null;
    await order.save();
    res.json(order);
  } catch (e) { next(e); }
});

// DELETE /api/orders/:id — delete order (admin only)
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
