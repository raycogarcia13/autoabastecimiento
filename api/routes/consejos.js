const { consejosValidationRules } = require('../validations/consejos')

module.exports = app => {

    app.route('/consejos')
        // .post(consejosValidationRules(), app.controllers.consejoController.store)
        .get(app.controllers.consejoController.index);

    app.put('/consejos/:id', app.controllers.consejoController.update);
    app.get('/consejos/:id', app.controllers.consejoController.show);
    app.get('/consejos_geometry/:id', app.controllers.consejoController.geojson);
    // app.delete('/states/:id', app.controllers.Social.stateController.delete)
}