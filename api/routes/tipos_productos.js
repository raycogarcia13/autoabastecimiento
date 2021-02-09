const middlewares = require("../libs/middlewares")
const { captadorValidationRules } = require('../validations/captador')

module.exports = app => {

    // app.route('/tipos')
    // .post(unidadValidationRules(), app.controllers.unidadController.store)
    // .get(app.controllers.unidadController.index);

    // app.get('/captador/:id', app.controllers.captadorController.index)
    app.post('/captador', app.controllers.captadorController.index);
    app.put('/captador', captadorValidationRules(), middlewares.validate, app.controllers.captadorController.store);
}