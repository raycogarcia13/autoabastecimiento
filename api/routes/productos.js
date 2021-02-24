// const { unidadValidationRules } = require('../validations/unidades')

module.exports = app => {

    app.route('/productos')
        .get(app.controllers.productosController.index);


    // app.get('/puntos_geometry/:id', app.controllers.puntosController.geojson);
}