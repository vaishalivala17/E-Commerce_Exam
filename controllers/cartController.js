const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
        
        if (!cart) {
            cart = new Cart({ user: req.user._id, cartItems: [], totalPrice: 0 });
            await cart.save();
        }
        
        res.render('cart', { cart, error: null });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.render('cart', { cart: null, error: 'Error loading cart' });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, qty } = req.body;
        
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.redirect('/products');
        }
        
        if (product.stock < qty) {
            return res.redirect('/products');
        }
        
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            cart = new Cart({ user: req.user._id, cartItems: [], totalPrice: 0 });
        }
        
        // Check if item already in cart
        const itemIndex = cart.cartItems.findIndex(item => 
            item.product.toString() === productId
        );
        
        if (itemIndex > -1) {
            // Update existing item
            cart.cartItems[itemIndex].qty += qty;
        } else {
            // Add new item
            cart.cartItems.push({
                product: productId,
                name: product.name,
                price: product.price,
                qty: qty,
                image: product.image
            });
        }
        
        await cart.save();
        res.redirect('/cart');
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.redirect('/products');
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { qty } = req.body;
        
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.redirect('/cart');
        }
        
        const itemIndex = cart.cartItems.findIndex(item => 
            item._id.toString() === req.params.itemId
        );
        
        if (itemIndex > -1) {
            if (qty <= 0) {
                cart.cartItems.splice(itemIndex, 1);
            } else {
                cart.cartItems[itemIndex].qty = qty;
            }
            
            await cart.save();
        }
        
        res.redirect('/cart');
    } catch (error) {
        console.error('Error updating cart:', error);
        res.redirect('/cart');
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.redirect('/cart');
        }
        
        cart.cartItems = cart.cartItems.filter(item => 
            item._id.toString() !== req.params.itemId
        );
        
        await cart.save();
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.redirect('/cart');
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (cart) {
            cart.cartItems = [];
            cart.totalPrice = 0;
            await cart.save();
        }
        
        res.redirect('/');
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.redirect('/cart');
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
