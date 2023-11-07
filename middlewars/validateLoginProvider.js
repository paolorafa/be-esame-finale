const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = (req, res, next) => {


    const tokenProvider = req.header('Authorization')
    

    if (!tokenProvider) {
        return res.status(401).send({
            message: "è necessario un token valido",
            statuscode: 401,
            error: 'token non presente'
        })
    }

    try {
        //verifico il token
        const veriedToken = jwt.verify(tokenProvider, process.env.JWT_SECRET_KEY);
        req.user=veriedToken
        next()
      

        
    } catch (err) {
        res.status(403).send({
            statuscode: 402,
            erro: 'token error',
            message: 'token scaduto o non valido'
        })
    }



}

