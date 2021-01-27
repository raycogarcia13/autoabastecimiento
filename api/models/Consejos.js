const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;

    const polygonSchema = new Schema({
        type: String,
        coordinates: [
            [
                [
                    [Number]
                ]
            ]
        ]
    });

    const Model = new Schema({
        nombre: { type: String, required: true, index: { unique: true } },
        habitantes: { type: Number, required: true },
        location: polygonSchema
    });

    return mongoose.model('Consejo', Model)
}