const mongoose = require('mongoose');


const CategorySchema = mongoose.Schema({
    category: String
}, {timestamps: true, strict: true});

module.exports = mongoose.model('categoryModel', CategorySchema, 'category');