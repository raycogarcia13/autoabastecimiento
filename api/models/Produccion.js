const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;


    const Data = new Schema({
        fecha: {
            mes: { type: Number, required: true, default: new Date().getMonth() + 1 },
            anno: { type: Number, required: true, default: new Date().getFullYear() }
        },
        fechad: { type: Date, required: true, default: Date.now() },
        producciones: [{
            producto_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Cultivos' },
            siembra: { type: Number, required: true, default: 0 },
            ratificado: { type: Number, required: true, default: 0 }
        }]
    });

    return mongoose.model('Produccion', Data)
}