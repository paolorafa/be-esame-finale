const express = require('express')
const loginProvider = express.Router()
const bcrypt = require('bcrypt')
const ProviderModel = require('../modules/editorProviders')
const jwt = require('jsonwebtoken')
require('dotenv').config()




loginProvider.post('/loginprovider', async (req, res) => {
    const provide = await ProviderModel.findOne({ email: req.body.email })


    if (!provide) {
        return res.status(404).send({
            message: "fornitore errato o inesistente",
            statuscode: 404
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, provide.password)

    if (!validPassword) {
        return res.status(401).send({
            statuscode: 404,
            message: "email o password errati"
        })
    }


   
            // Se l'invio del codice segreto via email ha successo, genera il token JWT
            const token = jwt.sign({
                id: provide._id,
                name: provide.name,
                lastname: provide.lastname,
                email: provide.email,
                socity: provide.socity,
                role: provide.role,
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: '72h'
            })
        
            res.header('Authorization', token).status(200).send({
                message: 'login effettuato',
                statuscode: 200,
                token
            })
        })
        


    module.exports = loginProvider;