const express = require('express');
const { protect, admin } = require('../middleware/auth');
const { 
    getProducts, 
    getProductById, 
    getMyProducts, 
    getAllProductsAdmin,
    showAddProductForm,
    addProduct,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

// View Routes (EJS) - Using Controllers

// Get all products - View route (public)
router.get('/', getProducts);

// Get my products - View route (authenticated users)
router.get('/my-products', protect, getMyProducts);

// Get all products - View route (admin only)
router.get('/all-products', protect, admin, getAllProductsAdmin);

// Add product form - View route (authenticated users)
router.get('/add', protect, showAddProductForm);

// Add product - View route (post handler)
router.post('/add', protect, addProduct);

// Delete product - View route (admin or owner can delete)
router.get('/delete/:id', protect, deleteProduct);

// Get single product - View route
router.get('/:id', getProductById);

module.exports = router;
