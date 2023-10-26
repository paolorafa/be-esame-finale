const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  email: String, // Email dell'utente che richiede il recupero password
  token: String, // Token generato per il recupero password
  scadenza: Date // Data di scadenza del token
}, {timestamps: true, strict: true});

module.exports = mongoose.model('PasswordReset', passwordResetSchema, 'passwordRes');
