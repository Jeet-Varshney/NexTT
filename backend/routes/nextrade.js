const express = require('express');
const router = express.Router();
const TradeItem = require('../database/models/TradeItem');
const TradeMessage = require('../database/models/TradeMessage');

// Mock fallback data
const MOCK_ITEMS = [
  { _id: 't1', title: 'Engineering Physics Vol 1', description: 'Like new, no highlights', price: 250, negotiable: true, imageUrl: 'mock_book', category: 'Books', status: 'active', sellerId: 'user123', createdAt: new Date() },
  { _id: 't2', title: 'Mini Drafter', description: 'Used for 1 semester, perfectly calibrated', price: 150, negotiable: false, imageUrl: 'mock_tool', category: 'Instruments', status: 'active', sellerId: 'user456', createdAt: new Date() }
];

let MOCK_MESSAGES = [];
let MOCK_DB_ITEMS = []; // To store created mock items

// GET /api/nextrade/items
router.get('/items', async (req, res) => {
  try {
    const items = await TradeItem.find({ status: 'active' }).sort({ createdAt: -1 });
    if (items.length === 0) return res.json([...MOCK_ITEMS, ...MOCK_DB_ITEMS].filter(i => i.status === 'active'));
    res.json(items);
  } catch {
    res.json([...MOCK_ITEMS, ...MOCK_DB_ITEMS].filter(i => i.status === 'active'));
  }
});

// GET /api/nextrade/items/all (Admin)
router.get('/items/all', async (req, res) => {
  try {
    const items = await TradeItem.find({}).sort({ createdAt: -1 });
    if (items.length === 0) return res.json([...MOCK_ITEMS, ...MOCK_DB_ITEMS]);
    res.json(items);
  } catch {
    res.json([...MOCK_ITEMS, ...MOCK_DB_ITEMS]);
  }
});

// GET /api/nextrade/items/:userId
router.get('/items/:userId', async (req, res) => {
  try {
    const items = await TradeItem.find({ sellerId: req.params.userId }).sort({ createdAt: -1 });
    if (items.length === 0) {
      const allMock = [...MOCK_ITEMS, ...MOCK_DB_ITEMS];
      return res.json(allMock.filter(i => i.sellerId === req.params.userId));
    }
    res.json(items);
  } catch {
    const allMock = [...MOCK_ITEMS, ...MOCK_DB_ITEMS];
    res.json(allMock.filter(i => i.sellerId === req.params.userId));
  }
});

// POST /api/nextrade/items
router.post('/items', async (req, res) => {
  try {
    const item = new TradeItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    const mockItem = {
      _id: `mock_item_${Date.now()}`,
      ...req.body,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    MOCK_DB_ITEMS.unshift(mockItem);
    res.status(201).json(mockItem);
  }
});

// PATCH /api/nextrade/items/:itemId/status
router.patch('/items/:itemId/status', async (req, res) => {
  try {
    const item = await TradeItem.findByIdAndUpdate(req.params.itemId, { status: req.body.status }, { new: true });
    if (!item) { // Mock fallback mapping
       const mId = MOCK_DB_ITEMS.findIndex(i => i._id === req.params.itemId);
       if (mId > -1) { MOCK_DB_ITEMS[mId].status = req.body.status; return res.json(MOCK_DB_ITEMS[mId]); }
       const oId = MOCK_ITEMS.findIndex(i => i._id === req.params.itemId);
       if (oId > -1) { MOCK_ITEMS[oId].status = req.body.status; return res.json(MOCK_ITEMS[oId]); }
       return res.status(404).json({message: 'Not found'});
    }
    res.json(item);
  } catch {
    res.json({ message: 'Mock updated' });
  }
});

// GET /api/nextrade/chat/:itemId
// In a highly robust app, we query by itemId + buyerId + sellerId. For simplicity we group by itemId.
router.get('/chat/:itemId', async (req, res) => {
  try {
    const messages = await TradeMessage.find({ itemId: req.params.itemId }).sort({ createdAt: 1 });
    if(messages.length === 0) return res.json(MOCK_MESSAGES.filter(m => m.itemId === req.params.itemId));
    res.json(messages);
  } catch {
    res.json(MOCK_MESSAGES.filter(m => m.itemId === req.params.itemId));
  }
});

// POST /api/nextrade/chat
router.post('/chat', async (req, res) => {
  try {
    const msg = new TradeMessage(req.body);
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    const mockMsg = { _id: `msg_${Date.now()}`, ...req.body, status: 'sent', createdAt: new Date() };
    MOCK_MESSAGES.push(mockMsg);
    res.status(201).json(mockMsg);
  }
});

// PATCH /api/nextrade/chat/:msgId/status -> updating offer status ('accepted' / 'rejected')
router.patch('/chat/:msgId/status', async (req, res) => {
  try {
    const message = await TradeMessage.findByIdAndUpdate(req.params.msgId, { status: req.body.status }, { new: true });
    if (!message) {
      const mIdx = MOCK_MESSAGES.findIndex(m => m._id === req.params.msgId);
      if (mIdx > -1) { MOCK_MESSAGES[mIdx].status = req.body.status; return res.json(MOCK_MESSAGES[mIdx]); }
      return res.status(404).json({message: 'Not found'});
    }
    res.json(message);
  } catch {
    res.json({ message: 'Status updated mockingly' });
  }
});

// GET /api/nextrade/chats/user/:userId
router.get('/chats/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Find messages where user is either sender or receiver
    const messages = await TradeMessage.find({ $or: [{ senderId: userId }, { receiverId: userId }] })
                                       .populate('itemId');
    
    // Fallback if none in mongo but present in mock
    if (messages.length === 0 && MOCK_MESSAGES.length > 0) {
        const userMockChats = MOCK_MESSAGES.filter(m => m.senderId === userId || m.receiverId === userId);
        return res.json(userMockChats);
    }
    res.json(messages);
  } catch {
    const userMockChats = MOCK_MESSAGES.filter(m => m.senderId === userId || m.receiverId === userId);
    res.json(userMockChats);
  }
});

module.exports = router;
