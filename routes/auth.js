const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Register a new user or store
router.post('/register', authController.register);

// Log in as a user or store
router.post('/login', authController.login);

module.exports = router;