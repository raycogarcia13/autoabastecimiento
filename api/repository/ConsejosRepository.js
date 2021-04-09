var BaseRepository = require('./BaseRepository').BaseRepository;
const mongoose = require('mongoose');

function ConsejosRepository() {
    BaseRepository.call(this);

    this.model = mongoose.model('Consejo');
    this.fields = ['nombre', 'habitantes', 'location'];

    return this;
};

ConsejosRepository.prototype = Object.create(BaseRepository.prototype);

exports.ConsejosRepository = ConsejosRepository;