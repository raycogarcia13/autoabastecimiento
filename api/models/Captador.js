const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;

    const Data = new Schema({
        fecha: { type: Date, required: true, default: Date.now() },
        comercializadora_id: { type: mongoose.Types.ObjectId, required: true },
        viandas: [{
            producto_id: { type: mongoose.Types.ObjectId, required: true },
            cant: { type: Number, required: true },
            um: { type: String, required: true, default: 'kg' }
        }],
        hortalizas: [{
            producto_id: { type: mongoose.Types.ObjectId, required: true },
            cant: { type: Number, required: true },
            um: { type: String, required: true, default: 'kg' }
        }],
        frutales: [{
            producto_id: { type: mongoose.Types.ObjectId, required: true },
            cant: { type: Number, required: true },
            um: { type: String, required: true, default: 'kg' }
        }],
        granos: [{
            producto_id: { type: mongoose.Types.ObjectId, required: true },
            cant: { type: Number, required: true },
            um: { type: String, required: true, default: 'kg' }
        }],
        proteinas: [{
            producto_id: { type: mongoose.Types.ObjectId, required: true },
            cant: { type: Number, required: true },
            um: { type: String, required: true, default: 'kg' }
        }],
    });

    return mongoose.model('Captador', Data)
}