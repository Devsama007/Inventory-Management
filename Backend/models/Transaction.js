const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },

    type: {
        type: String,
        enum: ['INITIAL', 'INCREASE', 'DECREASE'],
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Transaction', TransactionSchema);