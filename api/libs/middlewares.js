const jwt = require('jsonwebtoken');
const passRoute = require('../config/authPass')
const { validationResult } = require('express-validator')
const config = require('../config/config')
const mongoose = require('mongoose');

module.exports = {
    //verificar token en las rutas q no esten definidas
    verifyToken: (req, res, next) => {
        const Token = mongoose.model('Token')
        if (passRoute.find(el => el === req.url)) {
            next();
        } else {
            //verificacion de token
            var token = req.headers.authorization
            if (token) {
                // verifies secret and checks if the token is expired
                let tkn = token.replace(/^Bearer\s/, '');
                jwt.verify(tkn, config.JWT_SECRET, function(err, decoded) {
                    if (err) {
                        return res.status(401).json({ message: 'unauthorized' })
                    } else {
                        Token.find({ token: tkn }, (err, data) => {
                            if (data.length == 0)
                                return res.status(401).json({ message: 'token expired' })

                            return next();
                        })
                    }
                });
            } else {
                return res.status(401).json({ message: 'unauthorized' })
            }
        }
    },
    // middleware para los mensajes de errores de validación
    validate: (req, res, next) => {
        // return next();
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push({
            [err.param]: err.msg
        }))

        return res.status(422).json({
            errors: extractedErrors,
        })
    },
    //middlewares para verificacion de permisos
    requireAdmin: (req, res, next) => {},
    requireRoot: (req, res, next) => {},
    requireStore: (req, res, next) => {}
}