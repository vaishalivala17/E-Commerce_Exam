const express = require('express');
const { protect } = require('../middleware/auth');
const { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
} = require('../controllers/cartController');

const router = express.Router();

// Cart Routes - Using Controllers

// Get user cart
router.get('/', protect, getCart);

// Add item to cart
router.post('/', protect, addToCart);

// Update cart item quantity
router.put('/:itemId', protect, updateCartItem);

// Remove item from cart
router.delete('/:itemId', protect, removeFromCart);

// Clear cart
router.delete('/', protect, clearCart);

module.exports = router;
