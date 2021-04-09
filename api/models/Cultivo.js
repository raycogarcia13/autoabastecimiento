const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;

    const Data = new Schema({
        nombre: { type: String, required: true, index: { unique: true } },
        tipo_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Tipo' },
        sipa_id: { type: Number, required: false },
        rendimiento: { type: Number, required: true, default: 1 }
    });

    return mongoose.model('Cultivos', Data)
}