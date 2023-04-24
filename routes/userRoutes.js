const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const usersController = require('../controllers/usersController');

router.use(authMiddleware)



// Route for adding product to cart
router.post('/cart', usersController.addToCart);

// Route for removing product from cart
router.delete('/cart/:productId',  usersController.removeFromCart);

// Route for clearing cart
router.delete('/cart',  usersController.clearCart);

// Route for showing cart data
router.get('/cart',usersController.showCartData);

module.exports = router;