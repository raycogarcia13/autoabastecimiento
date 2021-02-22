const { produccionValidationRules, } = require('../validations/produccion')
const middlewares = require('../libs/middlewares')

module.exports = app => {
    app.put('/produccion', produccionValidationRules(), middlewares.validate, app.controllers.produccionController.store);
    app.get('/produccion/:anno/:mes', app.controllers.produccionController.index);
}