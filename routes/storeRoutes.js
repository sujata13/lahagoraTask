
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const storeController = require('../controllers/store');

// Routes for all stores
router.route('/')
  .get(storeController.getAllStores)
  .post(storeController.createNewStore);

// Routes for individual stores
router.route('/:storeId')
  .get(storeController.getStoreById)
  .patch(authMiddleware.authenticateStore, storeController.updateStore)
  .delete(authMiddleware.authenticateStore, storeController.deleteStore);

// Route for store login
router.post('/login', storeController.loginStore);

// Route for adding a product
router.post('/products', authMiddleware.authenticateStore, storeController.addProduct);

// Route for updating a product
router.patch('/products/:productId', authMiddleware.authenticateStore, storeController.updateProduct);

// Route for deleting a product
router.delete('/products/:productId', authMiddleware.authenticateStore, storeController.deleteProduct);

// Route for getting list of all products
router.get('/products', storeController.getAllProducts);

module.exports = router;