const  authorizationClient = (req, res, next) => {
    if (req.provider.role === 'user') {
        next();
    } else{
        res.status(403).send('access denied');
    }
} 

module.exports = authorizationClient;