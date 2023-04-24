const User = require('../models/User');
const Product = require('../models/product');

const addToCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Check if the product is already in the user's cart
    const index = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index !== -1) {
      // If the product is already in the cart, increment its quantity
      user.cart[index].quantity += 1;
    } else {
      // If the product is not in the cart, add it to the cart with quantity 1
      user.cart.push({ productId, quantity: 1 });
    }

    // Decrease the quantity of the product in the store's inventory
    const product = await Product.findById(productId);
    product.quantity -= 1;
    await product.save();

    await user.save();

    res.json(user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user.id);

    // Check if the product is in the user's cart
    const index = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      // If the product is not in the cart, return a 404 error
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    // Increase the quantity of the product in the store's inventory
    const product = await Product.findById(productId);
    product.quantity += user.cart[index].quantity;
    await product.save();

    // Remove the product from the cart
    user.cart.splice(index, 1);
    await user.save();

    res.json(user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Increase the quantity of each product in the store's inventory
    for (const item of user.cart) {
      const product = await Product.findById(item.productId);
      product.quantity += item.quantity;
      await product.save();
    }

    // Clear the user's cart
    user.cart = [];
    await user.save();

    res.json(user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const showCartData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');

    // Calculate the total price of all products in the cart
    const totalPrice = user.cart.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

    res.json({ cart: user.cart, totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addToCart, removeFromCart, clearCart, showCartData };