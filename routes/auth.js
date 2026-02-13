const express = require('express');
const { protect } = require('../middleware/auth');
const { 
    register, 
    login, 
    logout, 
    getProfile, 
    updateProfile,
    showLoginForm,
    showRegisterForm
} = require('../controllers/authController');

const router = express.Router();

// Show login form
router.get('/login', showLoginForm);

// Show register form  
router.get('/register', showRegisterForm);

// Handle register form submission
router.post('/register', register);

// Handle login form submission
router.post('/login', login);

// Handle logout
router.get('/logout', logout);

// Show profile page
router.get('/profile', protect, getProfile);

// Update profile
router.put('/profile', protect, updateProfile);

module.exports = router;
