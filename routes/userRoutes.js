const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const usersController = require('../controllers/user');

// Routes for all users
router.route('/')
  .get(authMiddleware.authenticateUser, usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(authMiddleware.authenticateUser, usersController.updateUser)
  .delete(authMiddleware.authenticateUser, usersController.deleteUser);

// Route for user login
router.post('/login', usersController.loginUser);

// Route for adding product to cart
router.post('/cart', authMiddleware.authenticateUser, usersController.addProductToCart);

// Route for removing product from cart
router.delete('/cart/:productId', authMiddleware.authenticateUser, usersController.removeProductFromCart);

// Route for clearing cart
router.delete('/cart', authMiddleware.authenticateUser, usersController.clearCart);

// Route for showing cart data
router.get('/cart', authMiddleware.authenticateUser, usersController.getCartData);

module.exports = router;