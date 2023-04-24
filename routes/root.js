const express = require('express')
const router = express.Router()
const path = require('path')
const auth = require('../middleware/auth');
const storeRoutes = require('./storeRoutes');
const userRoutes = require('./userRoutes');
const authRoutes = require('./auth');

// Middleware to check if the server is up
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is up and running' });
});

// Routes for store operations
router.use('/store', auth, storeRoutes);

// Routes for user operations
router.use('/user', auth, userRoutes);

// Routes for authentication
router.use('/auth', auth, authRoutes);

/*getting Index file*/
router.get('^/$|/index(.html)?', (req,res) =>{
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router