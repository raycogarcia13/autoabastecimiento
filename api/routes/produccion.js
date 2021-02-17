// const { unidadValidationRules } = require('../validations/unidades')

module.exports = app => {

    // app.route('/produccion')
    // .post(unidadValidationRules(), app.controllers.unidadController.store)
    // .get(app.controllers.produccionController.index);

    app.get('/produccion/:anno/:mes', app.controllers.produccionController.index);
    // app.get('/unidades/:id', app.controllers.unidadController.show);
    // app.get('/unidades_geometry/:id', app.controllers.unidadController.geojson);
    // app.delete('/states/:id', app.controllers.Social.stateController.delete)
}