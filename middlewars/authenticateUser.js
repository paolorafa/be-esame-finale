const ClientModel = require('../modules/client')

const authenticateUser = async (req, res, next) =>{
    const { email, password } = req.body

    try {
        const user = await ClientModel.findOne({ email, password })

        if (!user) {
            return res.status(401).send({
                error: 'email o password errati'
            })
        }

        req.user = user
        next()
    } catch (error) {
        console.error('Errore durante in login:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }



}

module.exports = authenticateUser