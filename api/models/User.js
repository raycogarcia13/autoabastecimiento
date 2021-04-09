const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;

    const User = new Schema({
        username: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true },
        email: { type: String, required: true, index: { unique: true } },
        name: { type: String, required: true },
        rol_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Rol' }
    });

    return mongoose.model('User', User)
}