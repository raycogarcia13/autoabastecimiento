module.exports = app => {

    app.post('/home/plan_real', app.controllers.queryController.plan_real);

}