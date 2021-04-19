module.exports = app => {
    app.get('/mapa/consejos', app.controllers.mapaController.consejos);
    app.get('/mapa/unidades', app.controllers.mapaController.unidades);
    app.get('/mapa/puntos', app.controllers.mapaController.puntos);
}