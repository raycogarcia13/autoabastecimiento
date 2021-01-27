const { userValidationRules } = require('../validations/userv')
    //const { validate } = require('../libs/middlewares')

module.exports = app => {

    app.route('/users')
        .post(userValidationRules(), app.controllers.userController.register)
        .get(app.controllers.userController.getAll);


    app.get('/users/:id', app.controllers.userController.findOne)
}