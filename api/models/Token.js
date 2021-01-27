const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;

    const Table = new Schema({
        user: { type: String, required: true },
        token: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now() },
        device: { type: String, required: true }
    });

    return mongoose.model('Token', Table)
}