const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },

    currentStock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    
}, {timestamps: true})

module.exports = mongoose.model('Product', ProductSchema);