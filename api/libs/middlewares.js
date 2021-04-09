const jwt = require('jsonwebtoken');
const passRoute = require('../config/authPass')
const { validationResult } = require('express-validator')
const config = require('../config/config')
const mongoose = require('mongoose');

module.exports = {
    //verificar token en las rutas q no esten definidas
    verifyToken: (req, res, next) => {
        const Token = mongoose.model('Token')
        const Audit = mongoose.model('Audit')
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

                            Audit({
                                request: JSON.stringify({ body: req.body, params: req.params }),
                                url: req.url,
                                username: decoded.user.username,
                                user_id: decoded.user._id
                            }).save();
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
    requireAdmin: (req, res, next) => {
        const Token = mongoose.model('Token')
        var token = req.headers.authorization
        let tkn = token.replace(/^Bearer\s/, '');
        jwt.verify(tkn, config.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).json({ message: 'unauthorized' })
            } else {
                if (decoded.user.rol_id.rol == 'root' || decoded.user.rol_id.rol == 'admin')
                    return next();
                else
                    return res.status(401).json({ message: 'unauthorized' })
            }
        });
    },
    requireRoot: (req, res, next) => {
        const Token = mongoose.model('Token')
        var token = req.headers.authorization
        let tkn = token.replace(/^Bearer\s/, '');
        jwt.verify(tkn, config.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).json({ message: 'unauthorized' })
            } else {
                if (decoded.user.rol_id.rol == 'root')
                    return next();
                else
                    return res.status(401).json({ message: 'unauthorized' })
            }
        });
    },
    requireUser: (req, res, next) => {
        const Token = mongoose.model('Token')
        var token = req.headers.authorization
        let tkn = token.replace(/^Bearer\s/, '');
        jwt.verify(tkn, config.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).json({ message: 'unauthorized' })
            } else {
                if (decoded.user.rol_id.rol == 'root' || decoded.user.rol_id.rol == 'admin' || decoded.user.rol_id.rol == 'user')
                    return next();
                else
                    return res.status(401).json({ message: 'unauthorized' })
            }
        });
    }
}