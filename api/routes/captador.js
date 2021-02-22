const middlewares = require("../libs/middlewares")
const { captadorValidationRules } = require('../validations/captador')

module.exports = app => {

    app.get('/get_tipos', app.controllers.tiposController.index);

    app.post('/captador', app.controllers.captadorController.index);
    app.put('/captador', captadorValidationRules(), middlewares.validate, app.controllers.captadorController.store);
    app.put('/captador', captadorValidationRules(), middlewares.validate, app.controllers.captadorController.store);

    app.post('/nocaptan', app.controllers.captadorController.noCaptan);

}