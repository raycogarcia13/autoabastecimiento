module.exports = app => {

    app.get('/login', app.controllers.authController.loginGet);

    app.post('/login', app.controllers.authController.login);

    app.post('/logout', app.controllers.authController.logout)

    app.get('/tokens', app.controllers.tokenController.getMyTokens)

    app.get('/me', app.controllers.authController.getMe)
}
