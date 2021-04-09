const mongoose = require('mongoose');
const config = require('../config/config')

module.exports = app => {
    let server;
    if (config.DB_AUTH == 1)
        server = 'mongodb://' + config.DB_USERNAME + '@' + config.DB_PASSWORD + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME + '';
    else
        server = 'mongodb://' + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME + '';

    mongoose.connect(server, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {
        console.log("MongoDB Connected...");
    });

}