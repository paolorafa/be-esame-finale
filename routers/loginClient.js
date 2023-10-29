const express = require('express')
const loginClient = express.Router()
const bcrypt = require('bcrypt')
const ClientModel = require('../modules/client')
const jwt = require('jsonwebtoken')
require('dotenv').config()


loginClient.post('/loginclient', async (req, res) => {
    const client = await ClientModel.findOne({ email: req.body.email })
   

    if (!client) {
        return res.status(404).send({
            message: "cliente errato o inesistente",
            statuscode: 404
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, client.password)

    if (!validPassword) {
        return res.status(401).send({
            statuscode: 404,
            message: "email o password errati"
        })
    }

    //generazione token
    const token = jwt.sign({
        id: client._id,
        name: client.name,
        lastname: client.lastname,
        email: client.email,
        role: client.role
    }, process.env.JWT_SECRET_KEY_CLIENT, {
        expiresIn: '72h'
    })

    res.header('Authorization', token).status(200).send({
        message:'login effettuato',
        statuscode: 200,
        token
    })

})

module.exports= loginClient