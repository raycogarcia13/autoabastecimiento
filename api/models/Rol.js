const mongoose = require('mongoose');

module.exports = app => {

    const Schema = mongoose.Schema;

    const Rol = new Schema({
        rol: { type: String, required: true, index: { unique: true } },
        rolename: { type: String, required: true }
    });

    return mongoose.model('Rol', Rol)
}