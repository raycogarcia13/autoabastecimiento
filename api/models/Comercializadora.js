const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;

    const pointSchema = new Schema({
        type: String,
        coordinates: [Number]
    });


    const Data = new Schema({
        nombre: { type: String, required: true, index: { unique: true } },
        consejo_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Consejo' },
        basep_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Basesp' },
        location: pointSchema
    });

    return mongoose.model('Comercializadora', Data)
}