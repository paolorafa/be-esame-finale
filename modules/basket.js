const mongoose = require('mongoose')


const BasketSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clientModel'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productModel'
  },
  quantity: { Number },
  price: { Number },


}, { timestamps: true, strict: true })

module.exports = mongoose.model('basketModel', BasketSchema, 'basket')