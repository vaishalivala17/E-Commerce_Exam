const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// Middleware to make user available to all views
const jwt = require('jsonwebtoken');
const User = require('./models/User');

app.use(async (req, res, next) => {
    try {
        let token;
        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            res.locals.user = user || null;
        } else {
            res.locals.user = null;
        }
    } catch (error) {
        res.locals.user = null;
    }
    next();
});

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const catagoryRoutes = require('./routes/catagory');

// Register Routes - Web Routes (NOT API)
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/catagory', catagoryRoutes);

// Home route
app.get('/', async (req, res) => {
    try {
        const Product = require('./models/Product');
        const products = await Product.find({}).limit(6).populate('user', 'name');
        res.render('index', { products });
    } catch (error) {
        console.error('Error in home route:', error);
        res.render('index', { products: [] });
    }
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/E-commerse_Platform', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

module.exports = app;
