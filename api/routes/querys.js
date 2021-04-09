const middlewares = require("../libs/middlewares")

module.exports = app => {

    app.get('/query/demanda_mes', app.controllers.queryController.demandaMes);
    app.get('/query/demanda_dia', app.controllers.queryController.demandaDia);
    app.get('/query/acomulado_mes', app.controllers.queryController.acomuladoMes);

    app.get('/query/cumplimiento/:tipo', app.controllers.queryController.cumplimento);

}