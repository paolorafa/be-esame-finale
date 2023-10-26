const express = require('express');
const provider = express.Router();
const bcrypt = require('bcrypt');
const ProviderModel = require('../modules/editorProviders')

provider.post('/providers/create',  async (req, res,) => {

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const newProvider = new ProviderModel({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            socity: req.body.socity,
            role: req.body.role

        })
        const provide = await newProvider.save();
        console.log(provide);

        if (req.body && req.body.role === 'admin') {
            res.status(201).send({
                statuscode: 201,
                message: "fornitore registrato",
                provide
            })

        } else {
            res.status(403).send('Accesso negato');
        }
    } catch (error) {
        res.status(500).send({
            message:'Errore durante la registrazione del fornitore',
            error: error
        })

    }
})



module.exports = provider