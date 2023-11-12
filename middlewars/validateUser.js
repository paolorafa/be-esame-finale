const validatePost = (req, res, next) => {
    const errors = []
    const { name, lastname, email, password } = req.body

    if (typeof name !== 'string') {
        errors.push('Il nome deve essere una stringa')
    }
    if (typeof lastname !== 'string') {
        errors.push('Il cognome deve essere una stringa')
    }
    if (typeof email !== 'string') {
        errors.push('la mail deve essere una stringa')
    }
    if (typeof password !== 'string') {
        errors.push('la password deve essere una stringa')
    }
    if (typeof image!== 'string') {
        errors.push('la immagine deve essere una stringa')
    }

    if (errors.length > 0) {
        res.status(400).send({ errors })
    } else if (name.trim() === "" || lastname.trim() === "" || email.trim() === "" || password.trim() === "") {
        res.status(400).send({ errors: ['Nomi, cognomi, email e password non possono essere vuoti.'] });
    } else {
        next();
    }
}


module.exports = validatePost