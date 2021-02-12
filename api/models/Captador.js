const mongoose = require('mongoose');
const moment = require('moment');

module.exports = app => {

    const Schema = mongoose.Schema;

    const Data = new Schema({
        fecha: {
            dia: { type: Number, required: true, default: new Date().getDate() + 1 },
            mes: { type: Number, required: true, default: new Date().getMonth() + 1 },
            anno: { type: Number, required: true, default: new Date().getFullYear() },
        },
        fechad: { type: Date, required: true, default: Date.now() },
        comercializadora_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Comercializadora' },
        Viandas: [{
            producto_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Cultivos' },
            cant: { type: Number, required: true },
            um: { type: String, required: true, default: 'kg' }
        }],
        Hortalizas: [{
            producto_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Cultivos' },
            cant: { type: Number, required: true },
            um: { type: String, required: true, default: 'kg' }
        }],
        Frutales: [{
            producto_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Cultivos' },
            cant: { type: Number, required: true },
            um: { type: String, required: true, default: 'kg' }
        }],
        Granos: [{
            producto_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Cultivos' },
            cant: { type: Number, required: true },
            um: { type: String, required: true, default: 'kg' }
        }],
        Proteinas: [{
            producto_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Cultivos' },
            cant: { type: Number, required: true },
            um: { type: String, required: true, default: 'kg' }
        }],
    });

    return mongoose.model('Captador', Data)
}