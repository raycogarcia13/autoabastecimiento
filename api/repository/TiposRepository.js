var BaseRepository = require('./BaseRepository').BaseRepository;
const mongoose = require('mongoose');

function TipoRepository() {
    BaseRepository.call(this);

    this.model = mongoose.model('Tipo');
    this.fields = ['nombre', 'indice', 'fecha'];

    return this;
};

TipoRepository.prototype = Object.create(BaseRepository.prototype);

exports.TipoRepository = TipoRepository;