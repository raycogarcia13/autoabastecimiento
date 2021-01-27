const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const config = require('../config/config')

module.exports = app => {
    const Token = mongoose.model('Token')
    return {
        getMyTokens: (req, res) => {
            var token = req.headers.authorization
            let payload = jwt.verify(token.replace(/^Bearer\s/, ''), config.JWT_SECRET)

            Token.find({ user: payload.id }, function(err, data) {
                if (err) {
                    return res.status(500).json({ message: 'Error getting records', error: err })
                }

                return res.json(data);
            })
        }
    }

}