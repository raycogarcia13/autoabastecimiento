const { body } = require('express-validator')
const mongoose = require('mongoose');
const Consejo = mongoose.model('Consejo')

const consejosValidationRules = () => {
    return [
        body('nombre', 'Please enter name').isLength({ min: 1 }),
        body('habitantes', 'Please enter email').isLength({ min: 1 }),
        // body('email').isEmail(),
        // body('email').custom(value => {
        //     return User.findOne({ email: value }).then(user => {
        //         if (user !== null) {
        //             return Promise.reject('Email is alredy in use');
        //         }
        //     })
        // }),
        // body('password', 'Please enter password').isLength({ min: 1 })
    ]
}

module.exports = {
    consejosValidationRules
}