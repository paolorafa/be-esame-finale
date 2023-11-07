const express = require('express')
const reset=express.Router()
const Provider = require('../modules/editorProviders')
const jwt = require('jsonwebtoken')
const ResetModel = require('../modules/passwordReset')


reset.post('/password-reset-provider', async (req,res) =>{
    const {email}=req.body

    const user = await Provider.findOne({email})

    if (!user){
        return res.status(404).send({
            message:"Fornitore non trovato"
        })
    }

    const token = jwt.sign({
       email
    }, process.env.JWT_SECRET_KEY_CLIENT, {
        expiresIn: '1h'
    })

    const resetEntry=new ResetModel({
        email:email,
        token:token,
        scadenza: new Date(Date.now()+60*60*1000)
    })

    try {
        const savedEntry = await resetEntry.save();
        res.status(200).send({
            message: "Richiesta di reset della password inviata con successo",
            token: token,
            savedEntry
        });
    } catch (error) {
        res.status(500).send({
            message: "Errore durante la creazione della richiesta di reset della password"
        });
    }

})

module.exports= reset