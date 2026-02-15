const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('user', 'name');
        res.render('products', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('products', { products: [], error: 'Failed to load products' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('user', 'name');
        
        if (product) {
            res.render('product-detail', { product });
        } else {
            res.status(404).redirect('/products');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(404).redirect('/products');
    }
};

const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user._id }).populate('user', 'name');
        res.render('my-products', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('my-products', { products: [], error: 'Failed to load products' });
    }
};

const getAllProductsAdmin = async (req, res) => {
    try {
        const products = await Product.find({}).populate('user', 'name email');
        res.render('all-products', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('all-products', { products: [], error: 'Failed to load products' });
    }
};

const showAddProductForm = (req, res) => {
    res.render('add-product');
};

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;
        
        const product = new Product({
            name,
            description,
            price,
            category,
            user: req.user._id,
            image: image || '/images/product-placeholder.jpg',
            stock: stock || 0
        });

        await product.save();
        res.redirect('/products/my-products');
    } catch (error) {
        console.error('Error adding product:', error);
        res.render('add-product', { error: 'Failed to add product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).redirect('/products/my-products');
        }
        
        // Check if user is admin or the owner of the product
        if (req.user.isAdmin || product.user.toString() === req.user._id.toString()) {
            await product.deleteOne();
            res.redirect('/products/my-products');
        } else {
            res.status(403).redirect('/products/my-products');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.redirect('/products/my-products');
    }
};

module.exports = {
    getProducts,
    getProductById,
    getMyProducts,
    getAllProductsAdmin,
    showAddProductForm,
    addProduct,
    deleteProduct
};
