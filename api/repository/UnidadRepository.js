var BaseRepository = require('./BaseRepository').BaseRepository;
const mongoose = require('mongoose');

function UnidadRepository() {
    BaseRepository.call(this);

    this.model = mongoose.model('Basesp');
    this.fields = ['nombre', 'tipo', 'location', 'consejo_id'];

    return this;
};

UnidadRepository.prototype = Object.create(BaseRepository.prototype);

exports.UnidadRepository = UnidadRepository;