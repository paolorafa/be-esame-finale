const express = require('express');
const provider = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const ProviderModel = require('../modules/editorProviders');
const { default: mongoose } = require('mongoose');
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const nodemailer = require('nodemailer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARI_CLUOD_NAME,
    api_key: process.env.CLOUDINARI_API_KEY,
    api_secret: process.env.CLOUDINARI_API_SECRET

})

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'cartellaEcommerceProvider',
        format: async (req, file) => 'png',
        public_id: (req, file) => file.name

    }
})
const cloudUpload = multer({ storage: cloudStorage })
provider.post('/providers/cloudUpload', cloudUpload.single('image'), async (req, res) => {
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
provider.post('/providers/create', async (req, res,) => {
    const sendSecretCode = (email, secretCode) => {
        return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'ronaldo.hand@ethereal.email',
                    pass: 'QEX2yW8wJax4ut3A4t'
                }
            });
            const mailOptions = {
                from: 'tuoindirizzoemail@gmail.com',
                to: email,
                subject: 'Codice Segreto di Conferma',
                text: `Il tuo codice segreto di conferma è: ${secretCode}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email inviata: ');
                    resolve();
                }
            });


        })
    }

    const generateSecretCode = () => {
        return crypto.randomBytes(32).toString("hex");
    }


    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const newProvider = new ProviderModel({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            socity: req.body.socity,
            role: req.body.role,
            image:req.body.image

        })
        const provide = await newProvider.save();
        console.log(provide);
        const secretCode = generateSecretCode();

        provide.secretCode = secretCode;
        await provide.save();



        sendSecretCode(provide.email, secretCode)
            .then(() => {
                console.log('codice inviato');
            })
            .catch((error) => {
                console.error('Errore nell\'invio del codice segreto:', error);
                res.status(500).json({ message: 'Errore nell\'invio del codice segreto via email' });
            });



    } catch (error) {
        res.status(500).send({
            message: 'Errore durante la registrazione del fornitore',
            error: error
        })

    }
})



provider.post('/verifycode', async (req, res) => {
    const { secretCode } = req.body;
    console.log(secretCode);


    try {
        console.log('Codice ricevuto:', secretCode);
        const cleanSecretCode= req.body.secretCode.trim()
        const provider = await ProviderModel.findOne({ secretCode: cleanSecretCode });
        console.log(provider);
        if (!provider) {
            console.log('Nessun fornitore trovato per questo codice:', secretCode);
            return res.status(404).send({
                message: "Fornitore non trovato",
                statuscode: 404
            });
        }

        
        if (provider.secretCode === secretCode) {
            provider.isVerified = true

            await provider.save()
            return res.status(201).send({ message: 'codice verificato' })
        }
        else {
            return res.status(409).send({ message: 'codice non corretto' })
        }

    } catch (error) {
        console.error("Errore nella verifica del codice:", error);
        return res.status(500).send({ message: 'Errore nella verifica del codice' });
    }

})
module.exports = provider