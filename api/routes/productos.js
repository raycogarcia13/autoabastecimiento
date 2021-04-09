// const { unidadValidationRules } = require('../validations/unidades')

module.exports = app => {

    app.route('/productos')
        .get(app.controllers.productosController.index);

    app.put('/productos', app.controllers.productosController.update);
}