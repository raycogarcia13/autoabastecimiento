const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/config')

module.exports = app => {
    const User = mongoose.model('User')
    const Rol = mongoose.model('Rol')
    const Token = mongoose.model('Token')
    return {
        register: (req, res) => {
            var user = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                name: req.body.name,
                rol_id: req.body.rol
            })

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(user.password, salt);
            user.password = hash;

            user.save(function(err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error saving data',
                        error: err
                    })
                }

                return res.json({
                    message: 'saved',
                    _id: user._id,
                    data: user
                })
            })
        },
        getAll: async(req, res) => {
            let user = await User.find()
                .populate('rol_id', ['rol', 'rolename']);

            return res.json(user);
        },
        findOne: (req, res) => {
            let id = req.params.id;
            User.findOne({ _id: id }, (err, user) => {
                if (err) {
                    return res.status(500).json({ message: 'Error getting records', error: err })
                }

                return res.json(user);
            })
        },
        getRoles: async(req, res) => {
            let roles = await Rol.find();

            return res.json(roles)
        },
        edit: async(req, res) => {
            let user = {
                email: req.body.email,
                name: req.body.name,
                rol_id: req.body.rol
            }
            let pass = req.body.password ? req.body.password : ''
            if (pass.length) {
                console.log(pass);
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(pass, salt);
                user.password = hash;
            }
            let id = req.body.id
            await User.findOneAndUpdate({ _id: id }, user);

            return res.json({ status: "success" })
        }
    }

}