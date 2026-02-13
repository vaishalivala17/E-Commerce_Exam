const mongoose = require('mongoose');

const catagorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        qty: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        image: {
            type: String
        }
    }],
    totalPrice: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate total price before saving
catagorySchema.pre('save', function(next) {
    this.totalPrice = this.cartItems.reduce((acc, item) => {
        return acc + (item.price * item.qty);
    }, 0);
    next();
});

module.exports = mongoose.model('Category', catagorySchema);
