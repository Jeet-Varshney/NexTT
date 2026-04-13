const express = require('express');
const router = express.Router();
const KitItem = require('../database/models/KitItem');
const KitOrder = require('../database/models/KitOrder');

// ─── MOCK DATA ────────────────────────────────
const MOCK_ITEMS = [
  { _id: 'k1', name: 'Spiral Notebook', description: 'A4 size, 200 pages, single ruled', price: 60, category: 'Stationary', emoji: '📓', isAvailable: true },
  { _id: 'k2', name: 'Blue Ballpoint Pen', description: 'Pack of 5 fine grip pens', price: 40, category: 'Stationary', emoji: '🖊️', isAvailable: true },
  { _id: 'k3', name: 'A4 Copy Paper', description: '500 sheets rim, 70 GSM', price: 250, category: 'Stationary', emoji: '📄', isAvailable: true },
  { _id: 'k4', name: 'Scientific Calculator', description: 'Casio fx-991EX ClassWiz', price: 1200, category: 'Academic Supplies', emoji: '🧮', isAvailable: true },
  { _id: 'k5', name: 'Geometry Box', description: 'Complete set with compass and protractor', price: 150, category: 'Academic Supplies', emoji: '📐', isAvailable: true },
  { _id: 'k6', name: 'Lab Coat', description: 'White cotton lab coat, unisex (Size: L)', price: 450, category: 'Lab Items', emoji: '🥼', isAvailable: true },
  { _id: 'k7', name: 'Safety Goggles', description: 'Clear anti-fog safety glasses', price: 120, category: 'Lab Items', emoji: '🥽', isAvailable: true },
  { _id: 'k8', name: 'Highlighters', description: 'Pack of 3 pastel colors', price: 80, category: 'Stationary', emoji: '🖍️', isAvailable: true },
];

let MOCK_ORDERS = [];

// GET /api/nexkit/items
router.get('/items', async (req, res) => {
  try {
    let items = await KitItem.find({ isAvailable: true });
    if (items.length === 0) items = MOCK_ITEMS;
    res.json(items);
  } catch {
    res.json(MOCK_ITEMS);
  }
});

// POST /api/nexkit/orders – Create order (Stationary or PrintJob)
router.post('/orders', async (req, res) => {
  const { userId, type, items, printDetails, deliveryMethod, deliveryAddress, paymentMethod, totalAmount } = req.body;
  
  try {
    const orderData = { userId, type, deliveryMethod, deliveryAddress, totalAmount, paymentMethod };
    if (type === 'Stationary') {
      orderData.items = items;
    } else if (type === 'PrintJob') {
      orderData.printDetails = printDetails;
    }

    const order = new KitOrder(orderData);
    await order.save();
    res.status(201).json({ message: 'Order placed', orderId: order._id, order });
  } catch (err) {
    // Mock success when DB unavailable
    const mockOrder = { 
        _id: `K-ORD-${Date.now()}`, 
        userId, type, deliveryMethod, deliveryAddress, totalAmount, paymentMethod,
        items: type === 'Stationary' ? items : undefined,
        printDetails: type === 'PrintJob' ? printDetails : undefined,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    MOCK_ORDERS.unshift(mockOrder);
    res.status(201).json({ message: 'Order placed (mock)', orderId: mockOrder._id, order: mockOrder });
  }
});

// GET /api/nexkit/orders/:userId – Recent orders
router.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await KitOrder.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(20);
    if(orders.length === 0 && MOCK_ORDERS.length > 0) {
       res.json(MOCK_ORDERS.filter(o => o.userId === req.params.userId));
       return;
    }
    res.json(orders);
  } catch {
    res.json(MOCK_ORDERS.filter(o => o.userId === req.params.userId));
  }
});

// PATCH /api/nexkit/orders/:orderId/cancel – Cancel within 3-min window
router.patch('/orders/:orderId/cancel', async (req, res) => {
  try {
    const order = await KitOrder.findById(req.params.orderId);
    if (!order) {
        // Check mock
        const mockOrder = MOCK_ORDERS.find(o => o._id === req.params.orderId);
        if(!mockOrder) return res.status(404).json({ message: 'Order not found' });
        
        const ageMs = Date.now() - new Date(mockOrder.createdAt).getTime();
        if (ageMs > 3 * 60 * 1000) {
            return res.status(400).json({ message: 'Cancellation window has expired (3 minutes).' });
        }
        mockOrder.status = 'Cancelled';
        mockOrder.isCancelled = true;
        return res.json({ message: 'Order cancelled successfully (mock).' });
    }

    const ageMs = Date.now() - new Date(order.createdAt).getTime();
    if (ageMs > 3 * 60 * 1000) {
      return res.status(400).json({ message: 'Cancellation window has expired (3 minutes).' });
    }

    order.status = 'Cancelled';
    order.isCancelled = true;
    await order.save();
    res.json({ message: 'Order cancelled successfully.' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/nexkit/upload – Mock print file upload
router.post('/upload', async (req, res) => {
    // Simulation of file upload latency
    setTimeout(() => {
        res.json({ 
            message: 'File uploaded successfully', 
            fileName: req.body?.fileName || `Doc_${Date.now()}.pdf`,
            fileUrl: `https://mock-storage.nxt/files/print-${Date.now()}.pdf` 
        });
    }, 1500); 
});

// GET /api/nexkit/print/jobs/:userId – Fetch print job history
router.get('/print/jobs/:userId', async (req, res) => {
    try {
        const orders = await KitOrder.find({ userId: req.params.userId, type: 'PrintJob' }).sort({ createdAt: -1 });
        if(orders.length === 0 && MOCK_ORDERS.length > 0) {
            res.json(MOCK_ORDERS.filter(o => o.userId === req.params.userId && o.type === 'PrintJob'));
            return;
        }
        res.json(orders);
    } catch {
        res.json(MOCK_ORDERS.filter(o => o.userId === req.params.userId && o.type === 'PrintJob'));
    }
});

module.exports = router;
