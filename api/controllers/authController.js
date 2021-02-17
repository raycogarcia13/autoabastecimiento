const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/config')

module.exports = app => {
    const User = mongoose.model('User');
    const Token = mongoose.model('Token');
    const Rol = mongoose.model('Rol');

    return {
        login: async(req, res) => {

            var username = req.body.username;
            var password = req.body.password;

            let user = await User.findOne({ username: username }, (err, user) => {
                if (err)
                    return res.status(401).json({ message: 'Usuario incorrecto', error: err })
            }).populate('rol_id', ['rol', 'rolename']);

            if (user) {
                if (!bcrypt.compareSync(password, user.password))
                    return res.status(401).json({ message: 'Contraseña incorrecta' })

                const payload = {
                    user: user,
                    id: user._id,
                    name: user.name
                }

                const token = jwt.sign(payload, config.JWT_SECRET);

                var newToken = new Token({
                    user: user._id,
                    token: token,
                    device: 'Por desarrollar'
                }).save();

                let rol = await Rol.findOne({ _id: user.rol_id });
                return res.json({
                    message: "Login correcto",
                    token: token,
                    data: { user, rol },
                });
            }
            return res.status(401).json({ message: 'Usuario incorrecto' })
        },
        loginGet: async(req, res) => {

            return res.send("holaa");

        },

        logout: async(req, res) => {
            var token = req.headers.authorization
            if (token) {
                let tkn = token.replace(/^Bearer\s/, '');
                await Token.deleteOne({ token: tkn }, (err, data) => {
                    return res.status(200).json({ message: 'logout success' })
                })

            }
        },

        getMe: (req, res) => {
            var sign = req.headers.authorization;

            if (sign) {
                let tkn = sign.replace(/^Bearer\s/, '');
                let payload = jwt.verify(tkn, config.JWT_SECRET, function(err, decoded) {
                    if (err) {
                        return res.status(401).json({ message: 'unauthorized' })
                    } else {
                        return res.status(200).json(decoded.user)
                    }
                });
            }

        }
    }

}