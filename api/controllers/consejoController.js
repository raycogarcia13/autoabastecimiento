const Repository = require('../repository/ConsejosRepository').ConsejosRepository;

module.exports = app => {

    var stateRepository = new Repository();

    return {
        store: (req, res) => {
            stateRepository.save(req, function(error, state) {
                if (!error) {
                    return res.json({ message: 'saved', _id: state._id, data: state });
                } else {
                    return res.status(500).json({ message: 'Error saving state', error: error });
                }
            });
        },
        index: (req, res) => {
            stateRepository.all(req, function(error, states) {
                if (!error) {
                    return res.json({ message: 'all data', data: states });
                } else {
                    return res.status(500).json({ message: 'Error getting states', error: error });
                }
            });
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
                    // let json = {
                    //     type: "MultiPolygon",
                    //     coordinates: state.location.coordinates
                    // }
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
                                "type": "MultiPolygon",
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