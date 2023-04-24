
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const storeController = require('../controllers/storesController');

router.use(authMiddleware)

// Routes for all stores
router.route('/')
  .post(storeController.register);

// Route for store login
router.post('/login', storeController.login);

// Route for adding a product
router.post('/products',  storeController.addProduct);

// Route for updating a product
router.patch('/products/:productId',  storeController.updateProduct);

// Route for deleting a product
router.delete('/products/:productId', storeController.deleteProduct);

// Route for getting list of all products
router.get('/products', storeController.getProductsList);

module.exports = router;