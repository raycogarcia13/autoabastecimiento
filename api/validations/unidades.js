const { body } = require('express-validator')
const mongoose = require('mongoose');
const Unidades = mongoose.model('Basesp')

const unidadValidationRules = () => {
    return [
        body('nombre', 'Please enter name').isLength({ min: 1 }),
        body('tipo', 'Please enter type').isLength({ min: 1 }),
        body('consejo_id', 'Please select consejo').isLength({ min: 1 }),
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
    unidadValidationRules
}