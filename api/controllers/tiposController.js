const mongoose = require('mongoose');

module.exports = app => {

    var Tipos = mongoose.model('Tipo');

    return {
        index: async(req, res) => {

            let data = await Tipos.find();

            return res.json({ message: 'all data', data: data });

        }
    }

}