const Repository = require('../repository/PuntosRepository').PuntosRepository;
const mongoose = require('mongoose');

module.exports = app => {

    var Comer = mongoose.model('Comercializadora');
    var stateRepository = new Repository();

    return {
        store: async(req, res) => {

            console.log(req.body);
            let item = await Comer({
                nombre: req.body.nombre,
                consejo_id: req.body.consejo_id,
                basep_id: req.body.basep_id,
                location: {
                    type: "Point",
                    coordinates: req.body.geometry
                }
            }).save()

            return res.json({ status: 'success', item });
        },

        index: async(req, res) => {

            let data = await Comer.find()
                .populate('basep_id', 'nombre')
                .populate('consejo_id', 'nombre')
                .select('nombre consejo_id');

            return res.json({ message: 'all data', data: data });

        },
        show: (req, res) => {
            stateRepository.findOne(req, function(error, state) {
                if (!error) {
                    return res.json({ message: 'state found', data: state });
                } else {
                    return res.status(500).json({ message: 'Error getting state', error: error });
                }
            });
        },
        geojson: (req, res) => {
            stateRepository.findOne(req, function(error, state) {
                if (!error) {
                    let json = {
                        "type": "FeatureCollection",
                        "name": state.nombre,
                        "crs": [
                            { "type": "name" },
                            { "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }
                        ],
                        "features": [{
                            "type": "Feature",
                            "properties": state,
                            "geometry": {
                                "type": "Point",
                                "coordinates": state.location.coordinates
                            }
                        }]
                    }
                    return res.json(json);
                } else {
                    return res.status(500).json({ message: 'Error getting state', error: error });
                }
            });
        },
        update: (req, res) => {
            stateRepository.update(req, req.params.id, function(error, state) {
                if (!error) {
                    return res.json({ message: 'state updated', data: state });
                } else {
                    return res.status(500).json({ message: 'Error updating state', error: error });
                }
            });
        }
    }

}