const mongoose = require('mongoose');

module.exports = app => {

    var Prod = mongoose.model('Cultivos');

    return {
        index: async(req, res) => {

            let data = await Prod.find()
                .populate('tipo_id', 'nombre');

            return res.json({ message: 'all data', data: data });

        }
    }

}