const express = require('express');
const router = express.Router();
const MenuItem = require('../database/models/MenuItem');
const Order = require('../database/models/Order');
const Address = require('../database/models/Address');

// ─── MOCK DATA (used when DB is not connected) ────────────────────────────────
let MOCK_MENU = [
  { _id: 'm1', name: 'Masala Maggi', description: 'Spicy instant noodles with veggies', price: 40, category: 'Snacks', prepTime: 7, emoji: '🍜', isAvailable: true },
  { _id: 'm2', name: 'Veg Burger',   description: 'Crispy patty with lettuce & sauce', price: 60, category: 'Snacks', prepTime: 10, emoji: '🍔', isAvailable: true },
  { _id: 'm3', name: 'Paneer Rice',  description: 'Flavourful cottage cheese fried rice', price: 90, category: 'Meals', prepTime: 15, emoji: '🍚', isAvailable: true },
  { _id: 'm4', name: 'Dal & Roti',   description: 'Wholesome lentil curry with 3 rotis', price: 70, category: 'Meals', prepTime: 12, emoji: '🫓', isAvailable: true },
  { _id: 'm5', name: 'Cold Coffee',  description: 'Thick iced coffee with cream', price: 50, category: 'Beverages', prepTime: 5, emoji: '☕', isAvailable: true },
  { _id: 'm6', name: 'Masala Chai',  description: 'Classic spiced tea', price: 20, category: 'Beverages', prepTime: 3, emoji: '🍵', isAvailable: true },
  { _id: 'm7', name: 'Student Combo', description: 'Burger + Cold Coffee + Fries', price: 120, category: 'Combos', prepTime: 15, emoji: '🎯', isAvailable: true },
  { _id: 'm8', name: 'Snack Box',   description: 'Samosa x2 + Chai + Biscuits', price: 80, category: 'Combos', prepTime: 10, emoji: '📦', isAvailable: true },
  { _id: 'm9', name: 'French Fries', description: 'Golden crispy salted fries', price: 45, category: 'Snacks', prepTime: 8, emoji: '🍟', isAvailable: true },
  { _id: 'm10', name: 'Fresh Lime Soda', description: 'Refreshing sweet & salty soda', price: 30, category: 'Beverages', prepTime: 3, emoji: '🥤', isAvailable: true },
];

// GET /api/cafe/menu
router.get('/menu', async (req, res) => {
  try {
    let items = await MenuItem.find({ isAvailable: true });
    if (items.length === 0) items = MOCK_MENU;
    res.json(items);
  } catch {
    res.json(MOCK_MENU);
  }
});

// POST /api/cafe/menu (Admin)
router.post('/menu', async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch {
    const mockItem = {
      _id: 'm' + Date.now().toString().slice(-4),
      ...req.body,
      isAvailable: true
    };
    MOCK_MENU.unshift(mockItem);
    res.status(201).json(mockItem);
  }
});

// DELETE /api/cafe/menu/:itemId (Admin)
router.delete('/menu/:itemId', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.itemId);
    if (!item) throw new Error();
    res.json({ message: 'Deleted' });
  } catch {
    MOCK_MENU = MOCK_MENU.filter(m => m._id !== req.params.itemId && m.id !== req.params.itemId);
    res.json({ message: 'Mock Deleted' });
  }
});

// PUT /api/cafe/menu/:itemId (Admin Edit)
router.put('/menu/:itemId', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
    if (!item) throw new Error();
    res.json(item);
  } catch {
    const idx = MOCK_MENU.findIndex(m => m._id === req.params.itemId || m.id === req.params.itemId);
    if (idx > -1) {
      MOCK_MENU[idx] = { ...MOCK_MENU[idx], ...req.body };
      res.json(MOCK_MENU[idx]);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  }
});

// POST /api/cafe/orders – Create order
router.post('/orders', async (req, res) => {
  const { userId, items, orderType, deliveryAddress, paymentMethod } = req.body;
  const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalPrepTime = Math.max(...items.map(i => i.prepTime));

  try {
    const order = new Order({ userId, items, orderType, deliveryAddress, totalAmount, totalPrepTime, paymentMethod });
    await order.save();
    res.status(201).json({ message: 'Order placed', orderId: order._id, totalPrepTime });
  } catch {
    // Mock success when DB unavailable
    res.status(201).json({ message: 'Order placed', orderId: `ORD-${Date.now()}`, totalPrepTime });
  }
});

// GET /api/cafe/orders/:userId – Recent orders
router.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(20);
    res.json(orders);
  } catch {
    res.json([]);
  }
});

// PATCH /api/cafe/orders/:orderId/cancel – Cancel within 2-min window
router.patch('/orders/:orderId/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const ageMs = Date.now() - new Date(order.createdAt).getTime();
    if (ageMs > 2 * 60 * 1000) {
      return res.status(400).json({ message: 'Cancellation window has expired (2 minutes).' });
    }

    order.status = 'Cancelled';
    order.isCancelled = true;
    await order.save();
    res.json({ message: 'Order cancelled successfully.' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/cafe/addresses
router.post('/addresses', async (req, res) => {
  try {
    const addr = new Address(req.body);
    await addr.save();
    res.status(201).json(addr);
  } catch {
    res.status(201).json({ _id: 'mock-addr', ...req.body });
  }
});

// GET /api/cafe/addresses/:userId
router.get('/addresses/:userId', async (req, res) => {
  try {
    const addrs = await Address.find({ userId: req.params.userId });
    res.json(addrs);
  } catch {
    res.json([]);
  }
});

module.exports = router;
