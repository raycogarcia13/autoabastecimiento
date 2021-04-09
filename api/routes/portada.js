module.exports = app => {

    app.post('/home/plan_real', app.controllers.queryController.plan_real);

    app.get('/home/audit', app.controllers.homeController.audit);

    app.get('/home/libras/:limit', app.controllers.homeController.librasPerCapita);

    app.get('/home/tendencia/:limit', app.controllers.homeController.tendencia);

}