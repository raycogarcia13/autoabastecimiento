const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;

    const Data = new Schema({
        nombre: { type: String, required: true, index: { unique: true } },
        indice: { type: Number, required: true },
        fecha: { type: Date, required: true, default: Date.now() }
    });

    return mongoose.model('Tipo', Data)
}