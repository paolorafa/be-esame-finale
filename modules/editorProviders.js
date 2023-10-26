const mongoose = require('mongoose');

const SupplierSchema = mongoose.Schema ({
    name:{
        type: String,
        required: true
    }, 
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true   
    },
    password:{
        type: String,
        required: true,
        min: 6
    },
    socity: {
        type: String
    },
    role: {
        type: String
        
    }
}, {timestamps: true, srtict: true})

module.exports = mongoose.model('supplierModel', SupplierSchema, 'provider')