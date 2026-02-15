const express = require('express');
const Catagory = require('../models/Catagory');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const catagories = await Catagory.find({});
        res.render('catagory', { catagories, error: null });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.render('catagory', { catagories: [], error: 'Error loading categories' });
    }
});

router.get('/:categoryId', async (req, res) => {
    try {
        const category = await Catagory.findById(req.params.categoryId);
        
        if (!category) {
            return res.render('catagory', { 
                catagories: [],
                error: 'Category not found'
            });
        }
        
        const products = await Product.find({ category: req.params.categoryId }).populate('user', 'name');
        res.render('products', { 
            products,
            categoryName: category.name,
            error: null
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.render('products', { 
            products: [],
            error: 'Error loading category products'
        });
    }
});

module.exports = router;
