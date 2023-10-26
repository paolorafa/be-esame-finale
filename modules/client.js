const mongoose = require('mongoose')

const ClientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: true, strict: true })

module.exports = mongoose.model('clientModel', ClientSchema, 'client')