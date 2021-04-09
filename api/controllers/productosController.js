const mongoose = require('mongoose');

module.exports = app => {

    var Prod = mongoose.model('Cultivos');

    return {
        index: async(req, res) => {

            let data = await Prod.find()
                .populate('tipo_id', 'nombre');

            return res.json({ message: 'all data', data: data });

        },
        update: async(req, res) => {

            let item = await Prod.findOne({ _id: req.body._id });

            if (item) {
                item.sipa_id = req.body.sipa_id;
                item.rendimiento = req.body.rendimiento;
                item.nombre = req.body.nombre;
                await item.save();

                return res.json({ status: 'success', item });
            } else
                return res.status(406).json({ error: 'Error getting data' });


        }
    }

}