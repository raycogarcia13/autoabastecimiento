var BaseRepository = require('./BaseRepository').BaseRepository;
const mongoose = require('mongoose');

function ProductosRepository() {
    BaseRepository.call(this);

    this.model = mongoose.model('Cultivos');
    this.fields = ['nombre', 'tipo_id'];

    return this;
};

ProductosRepository.prototype = Object.create(BaseRepository.prototype);

exports.ProductosRepository = ProductosRepository;