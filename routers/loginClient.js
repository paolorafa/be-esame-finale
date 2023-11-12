const express = require('express')
const loginClient = express.Router()
const bcrypt = require('bcrypt')
const ClientModel = require('../modules/client')
const jwt = require('jsonwebtoken')
const authenticateUser = require ('../middlewars/authenticateUser')
require('dotenv').config()


loginClient.post('/loginclient',authenticateUser, async (req, res) => {
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
        image: client.image,
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
loginClient.get('/loginclient/:id', async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    if (!id) {
        return res.status(400).send({
            statuscode: 400,
            message: "L'ID del cliente non è stato fornito correttamente"
        });
    }
    try {
        const client = await ClientModel.findById(id);
        console.log(client);

        if (!client) {
            return res.status(404).send({
                statuscode: 404,
                message: "Prodotto non trovato"
            });
        }

        res.status(200).send({
            statuscode: 200,
            client: client
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            statuscode: 500,
            message: "Errore interno del server"
        });
    }
});

module.exports= loginClient