const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    nameProduct: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        require
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'categoryModel',
    },
    image: {
        type: String,
        require
    },
    quantity:{
        type:Number
    },
    scount: {
        type: String,
        value: Number
    }
}, { timestamps: true, strict: true })

module.exports = mongoose.model('productModel', ProductSchema, 'product')