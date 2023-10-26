const express = require('express')
const basket = express.Router()

const BasketModel = require('../modules/basket')

basket.get('/basket', async (req, res) => {
    try {
        const baskets = await BasketModel.find()
        .populate('productId')

        res.status(200).send({
            statuscode: 200,
            basket: baskets
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: 'errore interno del server'
        })
    }
})


basket.post('/basket/create', async (req, res) =>{


    const newBasket = new BasketModel({
        userId: req.body.userId,
        productId: req.body.productId,
        quantity: req.body.quantity,
        price: req.body.price
            
        })


        try {
            const basketNew = await newBasket.save()
            res.status(200).send({
                statuscode:200,
                message:'carrello impletato',
                payload: basketNew
            })
        } catch (error) {
            res.status(500).send({
                statuscode: 500,
                message: 'error creating product',
                error: err
        })
    }
})

basket.patch('basket/update/:id', async (req,res) =>{
    const {id} = req.params;
    const basketExists= await BasketModel.findById(id)

    if(!basketExists){
        return res.status(400)({
            statuscode:404,
            message:'basket not found'
        })
    }


    try {
        const basketToUpdate= req.body;
        const options = {
            new: true
        }
        const result = await BasketModel.findByIdAndUpdate(id, basketToUpdate, options)
        res.status(200).json({ 
            statuscode:200,
            message:"basket to updated successfully",
            result
         })
    } catch (error) {
        res.status(500).send({
            statuscode: 500,
            message: 'error upload product',
            error: err
        })
    }

})

basket.delete('/basket/delete/:id', async (req,res) =>{
    const {id} = req.params;

    try {
        const basketToDelete= await BasketModel.findByIdAndDelete(id)
        if (!basketToDelete) {
            return res.status(400).json({
                statusCode: 400,
                message:"basket not found"
            })
        } 
        res.status(200).send({
            statuscode:200,
            message: "basket delete successfully"
        })
    } catch (error) {
        res.status(500).send({
            statuscode: 500,
            message: 'error delete product',
            error: err
        })
    }
})

module.exports = basket