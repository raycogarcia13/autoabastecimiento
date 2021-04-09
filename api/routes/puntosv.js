// const { unidadValidationRules } = require('../validations/unidades')

module.exports = app => {

    app.route('/puntos')
        .get(app.controllers.puntosController.index);


    app.get('/puntos_geometry/:id', app.controllers.puntosController.geojson);
}