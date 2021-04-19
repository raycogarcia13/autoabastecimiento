// const { unidadValidationRules } = require('../validations/unidades')

module.exports = app => {

    app.route('/productos')
        .get(app.controllers.productosController.index);

    app.get('/get_tipos', app.controllers.productosController.tipos);

    app.put('/productos', app.controllers.productosController.update);
    app.post('/productos', app.controllers.productosController.store);
}