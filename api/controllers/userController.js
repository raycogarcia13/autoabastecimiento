const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/config')

module.exports = app => {
    const User = mongoose.model('User')
    const Token = mongoose.model('Token')
    return {
        register: (req, res) => {
            var user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
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
        getAll: (req, res) => {
            User.find({}, function(err, data) {
                if (err) {
                    return res.status(500).json({ message: 'Error getting records', test: err })
                }

                return res.json(data);
            })
        },
        findOne: (req, res) => {
            let id = req.params.id;
            User.findOne({ _id: id }, (err, user) => {
                if (err) {
                    return res.status(500).json({ message: 'Error getting records', error: err })
                }

                return res.json(user);
            })
        }
    }

}
