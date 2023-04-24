const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Store = require('../models/Store');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userType = req.path.split('/')[1];
    let UserOrStore;

    if (userType === 'user') {
      UserOrStore = User;
    } else if (userType === 'store') {
      UserOrStore = Store;
    } else {
      throw new Error('Invalid user type');
    }

    const user = await UserOrStore.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserOrStore({ email, password: hashedPassword, ...req.body });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ success: true, data: { token, user: newUser } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userType = req.path.split('/')[1];
    let UserOrStore;

    if (userType === 'user') {
      UserOrStore = User;
    } else if (userType === 'store') {
      UserOrStore = Store;
    } else {
      throw new Error('Invalid user type');
    }

    const user = await UserOrStore.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, data: { token, user } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;