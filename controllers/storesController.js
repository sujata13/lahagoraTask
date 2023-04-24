const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Store = require('../models/Store');
const Product = require('../models/product');

// Register a new store
exports.register = async (req, res) => {
  const { name, email, password, phone_number, store_name } = req.body;

  try {
    // Check if store email already exists
    let store = await Store.findOne({ email });
    if (store) {
      return res.status(400).json({ message: 'Store already registered with this email' });
    }

    // Create new store object
    store = new Store({
      name,
      email,
      password,
      phone_number,
      store_name,
    });

    // Hash password and save store
    const salt = await bcrypt.genSalt(10);
    store.password = await bcrypt.hash(password, salt);
    await store.save();

    // Create and sign JWT token
    const payload = {
      user: {
        id: store.id,
        type: 'store',
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login a store
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if store exists
    const store = await Store.findOne({ email });
    if (!store) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, store.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create and sign JWT token
    const payload = {
      user: {
        id: store.id,
        type: 'store',
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, image, description, price, quantity } = req.body;
  const storeId = req.user.id;

  try {
    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(400).json({ message: 'Store not found' });
    }

    // Create new product object
    const product = new Product({
      name,
      image,
      description,
      price,
      quantity,
      store: storeId,
    });

    // Save product and update store's products list
    await product.save();
    store.products.push(product.id);
    await store.save();

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

//Update a product by id
exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Only update fields that are present in the request body
      if (req.body.name) {
        product.name = req.body.name;
      }
  
      if (req.body.image) {
        product.image = req.body.image;
      }
  
      if (req.body.description) {
        product.description = req.body.description;
      }
  
      if (req.body.price) {
        product.price = req.body.price;
      }
  
      if (req.body.quantity) {
        product.quantity = req.body.quantity;
      }
  
      const updatedProduct = await product.save();
  
      res.json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };


//Get Products List Page 
exports.getProductsList = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
  
      // Calculate the starting index of the products on the current page
      const startIndex = (page - 1) * limit;
  
      // Find all products and limit the results based on the pagination parameters
      const products = await Product.find()
        .skip(startIndex)
        .limit(parseInt(limit));
  
      // Get the total number of products in the database
      const totalProducts = await Product.countDocuments();
  
      res.json({
        products,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }; 