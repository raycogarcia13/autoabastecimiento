module.exports = app => {

    app.post('/query', app.controllers.authController.loginGet);

}