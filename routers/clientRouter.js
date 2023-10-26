const express = require('express');
const client = express.Router();
const bcrypt = require('bcrypt');
const ClientModel = require('../modules/client')

client.post('/client/create',  async (req, res,) => {
   
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const newProvider = new ClientModel({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role

        })
        const provide = await newProvider.save();
        console.log(provide);

        if (req.body && req.body.role === 'user') {
            res.status(201).send({
                statuscode: 201,
                message: "client registrato",
                provide
            })

        } else {
            res.status(403).send('Accesso negato');
        }
    } catch (error) {
        res.status(500).send({
            message:'Errore durante la registrazione del client',
            error: error
        })

    }
})



module.exports = client