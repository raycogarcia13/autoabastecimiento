// getDataController
module.exports = app => {

    app.get('/sipa/productos', app.controllers.getDataController.getProductos);
}