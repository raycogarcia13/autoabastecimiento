var BaseRepository = require('./BaseRepository').BaseRepository;
const mongoose = require('mongoose');

function PuntosRepository() {
    BaseRepository.call(this);

    this.model = mongoose.model('Comercializadora');
    this.fields = ['nombre', 'basep_id', 'location', 'consejo_id'];

    return this;
};

PuntosRepository.prototype = Object.create(BaseRepository.prototype);


PuntosRepository.prototype.getRelation = function(id, f) {
    let friend = mongoose.model('Comercializadora');

    friend.aggregate([{
            $match: {
                "consejo_id": mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "Consejo",
                localField: "_id",
                foreignField: "consejo_id",
                as: "friends_plus_histories"
            }
        },
        {
            $unwind: "$friends_plus_histories"
        },
        {
            $project: {
                "_id": 1,
                // "consejo_id": 1,
                // "friends_plus_histories._id": 1,
                // "friends_plus_histories.nombre": 1
            }
        }
    ], f);
}


exports.PuntosRepository = PuntosRepository;