const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;

    const User = new Schema({
        request: { type: String, required: true },
        url: { type: String, required: true },
        username: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now() },
        user_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Rol' }
    });

    return mongoose.model('Audit', User)
}