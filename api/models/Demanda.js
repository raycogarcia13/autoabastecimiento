const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;

    const Data = new Schema({
        fecha: { type: Date, required: true, default: Date.now() },
        demandas: [{
            demanda: { type: Number, required: true },
            indice: { type: Number, required: true },
            tipo_id: { type: mongoose.Types.ObjectId, required: true }
        }],
        habitantes: { type: Number, required: true },
        activo: { type: Boolean, required: true, default: true },
        consejo_id: { type: mongoose.Types.ObjectId, required: true }
    });

    return mongoose.model('Demanda', Data)
}