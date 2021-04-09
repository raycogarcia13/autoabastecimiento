const modelCultivo = require('../models/Cultivo');
const mongoose = require('mongoose');
const config = require('../config/config')
let asyncForEach = require("../libs/asyncForEach")

let sipa = async() => {
    //--------------------Configuracion------------------------------------//
    let server;
    if (config.DB_AUTH == 1)
        server = 'mongodb://' + config.DB_USERNAME + '@' + config.DB_PASSWORD + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME + '';
    else
        server = 'mongodb://' + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME + '';
    await mongoose.connect(server, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    modelCultivo();
    const Producto = mongoose.model('Cultivos');
    //--------------------------------- configuración hasta aqui----------//

    let sipa = require("../datas/sipa")

    await asyncForEach(sipa.cultivos, async(item) => {
        let cultivo = await Producto.findOne({ nombre: item.name });
        cultivo.sipa_id = item.sipa_id;
        cultivo.rendimiento = item.rend;
        await cultivo.save();
    });
    console.log('--------------------------');

    //--------cerrar conexión y terminar----------------------------//
    await mongoose.connection.close();
    console.log('Actualización completa');
}
sipa();