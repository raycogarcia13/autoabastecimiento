const { body } = require('express-validator')
const mongoose = require('mongoose');
const User = mongoose.model('User')

const userValidationRules = () => {
    return [
        body('name', 'Please enter name').isLength({ min: 1 }),
        body('username', 'Please enter username').isLength({ min: 1 }),
        body('email', 'Please enter email').isLength({ min: 1 }),
        body('email').isEmail(),
        body('email').custom(value => {
            return User.findOne({ email: value }).then(user => {
                if (user !== null) {
                    return Promise.reject('Email is alredy in use');
                }
            })
        }),
        body('username').custom(value => {
            return User.findOne({ username: value }).then(user => {
                if (user !== null) {
                    return Promise.reject('Username is alredy in use');
                }
            })
        }),
        body('password', 'Please enter password').isLength({ min: 1 })
    ]
}

const editValidationRules = () => {
    return [
        body('name', 'Please enter name').isLength({ min: 1 }),
        body('email', 'Please enter email').isLength({ min: 1 }),
    ]
}

module.exports = {
    userValidationRules,
    editValidationRules
}