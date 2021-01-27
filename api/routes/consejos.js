const { consejosValidationRules } = require('../validations/consejos')

module.exports = app => {

    app.route('/consejos')
        // .post(consejosValidationRules(), app.controllers.consejoController.store)
        .get(app.controllers.consejoController.index);

    app.put('/consejos/:id', consejosValidationRules(), app.controllers.consejoController.update);
    // app.get('/states/:id', app.controllers.Social.stateController.show);
    // app.get('/states/getAllComments/:state_id', app.controllers.Social.stateController.getAllComments);
    // app.delete('/states/:id', app.controllers.Social.stateController.delete)
}