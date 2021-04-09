function BaseRepository() {
    this.model = null;
    this.fields = null;

    return this;
};

BaseRepository.prototype.save = function(req, f) {
    var fiel = {};

    this.fields.forEach(element => {
        fiel[element] = req.body[element];
    });

    var mod = new this.model(fiel);

    mod.save(f);
};

BaseRepository.prototype.all = function(req, f) {
    this.model.find(f);
};

BaseRepository.prototype.findOne = function(req, f) {
    let id = req.params.id;

    this.model.findOne({ _id: id }, f);
};

BaseRepository.prototype.update = function(req, id, f) {
    var fiel = {};

    this.fields.forEach(element => {
        if (req.body[element]) {
            fiel[element] = req.body[element];
        }

    });

    this.model.findOneAndUpdate({ _id: id }, fiel, f);
};

BaseRepository.prototype.delete = function(req, id, f) {
    this.model.findOneAndRemove({ _id: id }, f);
};

exports.BaseRepository = BaseRepository;