const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;

    const Data = new Schema({
        nombre: { type: String, required: true, index: { unique: true } },
        tipo_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Tipo' }
    });

    return mongoose.model('Cultivos', Data)
}