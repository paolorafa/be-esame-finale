const express = require('express');
const products = express.Router();
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const validateLoginProvider = require('../middlewars/validateLoginProvider');

const ProductModel = require('../modules/product')


require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARI_CLUOD_NAME,
    api_key: process.env.CLOUDINARI_API_KEY,
    api_secret: process.env.CLOUDINARI_API_SECRET

})

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'cartellaEcommerce',
        format: async (req, file) => 'png',
        public_id: (req, file) => file.name

    }
})
const cloudUpload = multer({ storage: cloudStorage })
products.post('/products/cloudUpload', cloudUpload.single('image'), async (req, res) => {
    try {
        res.status(200).json({
            image: req.file.path
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: 'error creating product',
            error: err
        })
    }
})

products.post('/products/create', async (req, res) => {
    const newProduct = new ProductModel({
        nameProduct: req.body.nameProduct,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: req.body.image,
        quantity: req.body.quantity,
        scount: req.body.scout
    })
    try {
        const productNew = await newProduct.save()
        res.status(200).send({
            statuscode: 200,
            message: 'Product created successfully',
            payload: productNew
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: 'error creating product',
            error: err
        })
    }
});

products.patch('/products/update/:id', async (req, res) => {
    const { id } = req.params;
    const productExists = await ProductModel.findById(id);

    if (!productExists) {
        return res.status(404)({
            statuscode: 404,
            message: 'Product not found'
        })
    }

    try {
        const productToUpdate = req.body;
        const options = {
            new: true
        }

        const result = await ProductModel.findByIdAndUpdate(id, productToUpdate, options)
        console.log(result);
        res.status(200).send({
            statuscode: 200,
            message: 'Product updated successfully',
            result
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: 'error upload product',
            error: err
        })
    }
})

products.delete('/products/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const productToDelete = await ProductModel.findByIdAndDelete(id)
        if (!productToDelete) {
            return res.status(404).json({
                statuscode: 404,
                message: 'Product not found'
            });
        }
        res.status(200).send({
            statuscode: 200,
            message: 'Product successfully deleted'
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: 'error delete product',
            error: err
        })
    }
})

products.get('/products', async (req, res, next) => {
    try {
        const product = await ProductModel.find()
            .populate('category')

        res.status(200).send({
            statuscode: 200,
            product: product
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: "errore interno del server"
        })
    }

})
products.get('/products/:id', async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({
            statuscode: 400,
            message: "L'ID del prodotto non è stato fornito correttamente"
        });
    }
    try {
        const product = await ProductModel.findById(id).populate('category');
        console.log(product);

        if (!product) {
            return res.status(404).send({
                statuscode: 404,
                message: "Prodotto non trovato"
            });
        }

        res.status(200).send({
            statuscode: 200,
            product: product
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            statuscode: 500,
            message: "Errore interno del server"
        });
    }
});

products.get('/products/category/:_id', async (req, res) => {
     const { _id } = req.params
     console.log(_id);

    try {
        const product = await ProductModel.find({_id })
        if (!product) {
            return res.status(404).json({
                statuscode: 404,
                message: 'Product not found',
                
            });
        } res.status(200).send({
            statuscode: 200,
            message: 'Product successfully ',
            prodotti:product
        })

    } catch (error) {
        res.status(500).send({
            statuscode: 500,
            message: 'error retrivieng products',
            error: error
        })
    }

})



module.exports = products