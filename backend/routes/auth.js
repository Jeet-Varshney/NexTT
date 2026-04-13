const express = require('express');
const router = express.Router();
const User = require('../database/models/User');

let MOCK_USERS = [
  { username: 'demo', rollNo: 'DEMO01', email: 'demo@next.edu', branch: 'Computer Science', section: 'A', password: 'password123', role: 'Student', permissions: [] },
  { username: 'JeetVarshney', rollNo: 'ADMIN01', email: 'jeetvarshneyhk_cse25@its.edu.in', branch: 'Computer Science', section: 'A', password: 'admin', role: 'Super Admin', permissions: ['all'] }
];

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, rollNo, email, password, phone, branch, section } = req.body;

    // Check uniqueness manually for better error messaging
    const existing = await User.findOne({ $or: [{ username }, { email }, { rollNo }] });
    if (existing) {
       return res.status(409).json({ message: "Username, Email, or RollNo is already registered." });
    }

    let assignedRole = 'Student';
    let assignedPerms = [];
    if (username === 'JeetVarshney') {
      assignedRole = 'Super Admin';
      assignedPerms = ['all'];
    }

    const newUser = new User({
       username, rollNo, email, password, phone, branch, section, role: assignedRole, permissions: assignedPerms
    });

    await newUser.save();
    
    // Return user without password
    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json(userObj);
  } catch (error) {
    // Check if error is due to MongoDB connection issue or native constraint
    if (error.code === 11000) {
      return res.status(409).json({ message: "Identity conflict. User already exists." });
    }
    
    // MOCK OFFLINE FALLBACK
    const { username, rollNo, email, password, phone, branch, section } = req.body;
    
    // Check uniqueness locally
    const existingMock = MOCK_USERS.find(u => u.username === username || u.email === email || u.rollNo === rollNo);
    if (existingMock) {
       return res.status(409).json({ message: "Username, Email, or RollNo is already registered." });
    }
    
    let mockRole = 'Student';
    let mockPerms = [];
    if (username === 'JeetVarshney') {
      mockRole = 'Super Admin';
      mockPerms = ['all'];
    }
    
    const newMockUser = { username, rollNo, email, password, phone, branch, section, role: mockRole, permissions: mockPerms };
    MOCK_USERS.push(newMockUser);
    
    const mockRet = { ...newMockUser };
    delete mockRet.password;
    
    res.status(201).json(mockRet);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: "Please provide credentials." });
    }

    // Uniquely identify via username OR email OR rollNo
    const user = await User.findOne({
       $or: [
         { username: identifier },
         { email: identifier },
         { rollNo: identifier }
       ]
    });

    if (!user) {
       return res.status(404).json({ message: "User not found." });
    }

    // Verify Password (exact match for hackathon simplicity)
    if (user.password !== password) {
       return res.status(401).json({ message: "Invalid credentials." });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json(userObj);
  } catch (error) {
    // MOCK OFFLINE FALLBACK
    const { identifier, password } = req.body;
    
    const ident = identifier.toLowerCase();
    const mockUser = MOCK_USERS.find(u => 
       u.username.toLowerCase() === ident || 
       u.email.toLowerCase() === ident || 
       u.rollNo.toLowerCase() === ident
    );
    
    if (!mockUser) {
       return res.status(404).json({ message: "User not found." });
    }
    if (mockUser.password !== password) {
       return res.status(401).json({ message: "Invalid credentials." });
    }
    
    const mockRet = { ...mockUser };
    delete mockRet.password;
    res.status(200).json(mockRet);
  }
});

// PUT /api/auth/role - Upgrade or modify User permissions
router.put('/role', async (req, res) => {
  try {
    const { targetUsername, newRole, newPermissions } = req.body;
    
    // Attempt DB Update
    const user = await User.findOneAndUpdate(
       { username: targetUsername },
       { role: newRole, permissions: newPermissions },
       { new: true }
    );

    if (user) return res.status(200).json({ message: "Updated DB record successfully." });

    // Mock Fallback
    const mockUser = MOCK_USERS.find(u => u.username === targetUsername);
    if (!mockUser) return res.status(404).json({ message: "User not found." });
    
    mockUser.role = newRole;
    mockUser.permissions = newPermissions;
    return res.status(200).json({ message: "Updated Mock properly." });
  } catch (error) {
    return res.status(500).json({ message: "Server error handling privileges." });
  }
});

// GET /api/auth/users - Retrieve directory
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    if (users.length > 0) return res.status(200).json(users);
    
    // Return mock users safely
    res.status(200).json(MOCK_USERS.map(u => {
       const mapped = {...u}; delete mapped.password; return mapped;
    }));
  } catch (error) {
    res.status(200).json(MOCK_USERS.map(u => {
       const mapped = {...u}; delete mapped.password; return mapped;
    }));
  }
});

module.exports = router;
