const express = require('express')
const category = express.Router()

const CategoryModel = require ('../modules/category')

category.get('/category', async (req, res) => {
    try {
        const category = await CategoryModel.find()

        res.status(200).send({
            statuscode: 200,
            category: category
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: 'errore interno del server'
        })
    }
})

category.get('/category/:id', async (req, res) => {
    const {id}= req.params;
    const categoryExists = await CategoryModel.findById(id);

    if (!categoryExists){
        return res.status(404)({
            statuscode: 404,
            message: 'The category does not exist'
        })
    }
    try {
        const category = await CategoryModel.find()

        res.status(200).send({
            statuscode: 200,
            category: category
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: 'errore interno del server'
        })
    }
})

category.post('/category/create', async (req, res) => {
    const newCategory = new CategoryModel({
        category: req.body.category
    })
    try {
        const categoryNew = await newCategory.save()
        res.status(200).send({
            statuscode: 200,
            message: "category created successfully",
            paylod: categoryNew
        })
    } catch (error) {
        res.status(500).send({
            statuscode: 500,
            message: 'errore interno del server'
        })
    }
})

module.exports = category