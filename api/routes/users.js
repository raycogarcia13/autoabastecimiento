const { userValidationRules, editValidationRules } = require('../validations/userv')
const middlewares = require('../libs/middlewares')

module.exports = app => {

    app.route('/users')
        .post(userValidationRules(), middlewares.validate, middlewares.requireAdmin, app.controllers.userController.register)
        .put(editValidationRules(), middlewares.validate, middlewares.requireAdmin, app.controllers.userController.edit)
        .get(middlewares.requireAdmin, app.controllers.userController.getAll);

    app.get('/users/:id', middlewares.requireAdmin, app.controllers.userController.findOne)
    app.get('/roles', middlewares.requireAdmin, app.controllers.userController.getRoles)
}