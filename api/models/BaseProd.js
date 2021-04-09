const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;


    const pointSchema = new Schema({
        type: String,
        coordinates: [Number]
    });

    const Data = new Schema({
        nombre: { type: String, required: true, index: { unique: true } },
        tipo: { type: String, required: true },
        location: pointSchema
    });

    return mongoose.model('Basesp', Data)
}