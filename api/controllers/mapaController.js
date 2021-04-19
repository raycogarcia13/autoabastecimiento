let mongoose = require('mongoose')
let asyncForEach = require("../libs/asyncForEach")


module.exports = app => {

    const Consejo = mongoose.model('Consejo');
    const BasesP = mongoose.model('Basesp');
    const Puntos = mongoose.model('Comercializadora');

    return {
        consejos: async(req, res) => {
            try {
                let state = await Consejo.find();
                let json = {
                    "type": "FeatureCollection",
                    "name": 'Consejos populares',
                    "crs": [
                        { "type": "name" },
                        { "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }
                    ],
                    "features": []
                }
                state.forEach(element => {
                    json.features.push({
                        "type": "Feature",
                        "properties": element,
                        "geometry": {
                            "type": "MultiPolygon",
                            "coordinates": element.location.coordinates
                        }
                    })
                });
                return res.json(json);

            } catch (error) {

                return res.status(500).json({ message: 'Error getting state', error: error });
            }
        },
        unidades: async(req, res) => {
            try {
                let state = await BasesP.find();
                let json = {
                    "type": "FeatureCollection",
                    "name": 'Unidades Productivas',
                    "crs": [
                        { "type": "name" },
                        { "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }
                    ],
                    "features": []
                }
                state.forEach(element => {
                    json.features.push({
                        "type": "Feature",
                        "properties": element,
                        "geometry": {
                            "type": "Point",
                            "coordinates": element.location.coordinates
                        }
                    })
                });
                return res.json(json);

            } catch (error) {
                return res.status(500).json({ message: 'Error getting state', error: error });

            }

        },
        puntos: async(req, res) => {
            try {
                let state = await Puntos.find().populate('basep_id').populate('consejo_id');
                let json = {
                    "type": "FeatureCollection",
                    "name": 'Red de comercialización',
                    "crs": [
                        { "type": "name" },
                        { "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }
                    ],
                    "features": []
                }
                state.forEach(element => {
                    json.features.push({
                        "type": "Feature",
                        "properties": element,
                        "geometry": {
                            "type": "Point",
                            "coordinates": element.location.coordinates
                        }
                    })
                });
                return res.json(json);

            } catch (error) {
                return res.status(500).json({ message: 'Error getting state', error: error });

            }
        }
    }

}