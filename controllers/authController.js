const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Store = require('../models/Store');

const register = async (req, res) => {
  try {
    const { name, email, password, phone_number, country, store_name } = req.body;
    const userType = req.path.split('/')[1];
    let UserOrStore;

    if (userType === 'user') {
      UserOrStore = User;
    } else if (userType === 'store') {
      UserOrStore = Store;
    } else {
      throw new Error('Invalid user type');
    }

    const userExists = await UserOrStore.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserOrStore({
      name,
      email,
      password: hashedPassword,
      phone_number,
      country,
      store_name,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
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
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };



