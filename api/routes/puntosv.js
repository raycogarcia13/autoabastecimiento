// const { unidadValidationRules } = require('../validations/unidades')

module.exports = app => {

    app.route('/puntos')
        .get(app.controllers.puntosController.index)
        .post(app.controllers.puntosController.store);


    app.get('/puntos_geometry/:id', app.controllers.puntosController.geojson);
}