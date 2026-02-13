const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Show login form
// @route   GET /auth/login
// @access  Public
const showLoginForm = (req, res) => {
    res.render('login', { error: null });
};

// @desc    Show register form
// @route   GET /auth/register
// @access  Public
const showRegisterForm = (req, res) => {
    res.render('register', { error: null });
};

// @desc    Register new user
// @route   POST /auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.render('register', { 
                error: 'User already exists with this email',
                name,
                email
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.cookie('token', generateToken(user._id), {
                httpOnly: true,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict'
            });
            res.redirect('/');
        }
    } catch (error) {
        console.error('Register error:', error);
        res.render('register', { 
            error: error.message || 'Error registering user',
            name: req.body.name,
            email: req.body.email
        });
    }
};

// @desc    Authenticate user & login
// @route   POST /auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check password and user exists
        if (user && (await user.comparePassword(password))) {
            res.cookie('token', generateToken(user._id), {
                httpOnly: true,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict'
            });

            res.redirect('/');
        } else {
            res.render('login', { 
                error: 'Invalid email or password',
                email 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { 
            error: error.message || 'Error logging in',
            email: req.body.email
        });
    }
};

// @desc    Logout user / clear cookie
// @route   GET /auth/logout
// @access  Public
const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.redirect('/');
};

// @desc    Get user profile page
// @route   GET /auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.render('profile', { user, error: null });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.render('profile', { user: null, error: 'Error loading profile' });
    }
};

// @desc    Update user profile
// @route   PUT /auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.render('profile', { 
                user: updatedUser,
                error: null,
                message: 'Profile updated successfully'
            });
        } else {
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.error('Profile update error:', error);
        res.render('profile', { 
            user: req.user,
            error: error.message || 'Error updating profile'
        });
    }
};

module.exports = {
    showLoginForm,
    showRegisterForm,
    register,
    login,
    logout,
    getProfile,
    updateProfile
};
