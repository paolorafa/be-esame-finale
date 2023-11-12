const express = require('express');
const client = express.Router();
const bcrypt = require('bcrypt');
const ClientModel = require('../modules/client')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const validateUser = require ('../middlewars/validateUser')




cloudinary.config({
    cloud_name: process.env.CLOUDINARI_CLUOD_NAME,
    api_key: process.env.CLOUDINARI_API_KEY,
    api_secret: process.env.CLOUDINARI_API_SECRET

})

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'cartellaEcommerceClient',
        format: async (req, file) => 'png',
        public_id: (req, file) => file.name

    }
})
const cloudUpload = multer({ storage: cloudStorage })
client.post('/client/cloudUpload', cloudUpload.single('image'), async (req, res) => {
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






client.post('/client/create',validateUser, async (req, res,) => {

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const newProvider = new ClientModel({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            image:req.body.image,
            role: req.body.role

        })
        const client = await newProvider.save();
        console.log(client);

        res.status(201).send({
            statuscode: 201,
            message: "client registrato",
            client
        })


    } catch (error) {
        res.status(500).send({
            message: 'Errore durante la registrazione del client',
            error: error
        })

    }
})



module.exports = client