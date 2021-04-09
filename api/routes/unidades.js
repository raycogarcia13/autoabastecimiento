const { unidadValidationRules } = require('../validations/unidades')

module.exports = app => {

    app.route('/unidades')
        .post(unidadValidationRules(), app.controllers.unidadController.store)
        .get(app.controllers.unidadController.index);

    app.put('/unidades/:id', unidadValidationRules(), app.controllers.unidadController.update);
    app.get('/unidades/:id', app.controllers.unidadController.show);
    app.get('/unidades_geometry/:id', app.controllers.unidadController.geojson);
    // app.delete('/states/:id', app.controllers.Social.stateController.delete)
}