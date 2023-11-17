const bcrypt = require('bcrypt');
const ClientModel = require('../modules/client');

const authenticateUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await ClientModel.findOne({ email });

    if (!user) {
      return res.status(401).send({
        error: 'Email o password errati',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({
        error: 'Email o password errati',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

module.exports = authenticateUser;