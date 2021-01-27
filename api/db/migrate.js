const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
let consejos = require("../datas/consejosP")

module.exports = async(app) => {

    const Rol = mongoose.model('Rol')
    const User = mongoose.model('User')
    const Consejo = mongoose.model('Consejo')

    let roles = await Rol.find()
    if (!roles.length) {

        //generacion de los roles de la app
        let enpa = await Rol({
            rol: 'root',
            rolename: 'Super Admin'
        }).save();
        Rol({
            rol: 'admin',
            rolename: 'Administrador'
        }).save();
        Rol({
            rol: 'user',
            rolename: 'Usuario'
        }).save();
        Rol({
            rol: 'boss',
            rolename: 'Jefe'
        }).save();

        //generacion del usuario root
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync('kronosk13', salt);
        let user = await User({
            username: 'root',
            password: hash,
            email: 'geomatica@enpa.iju.minag.cu',
            name: 'ENPA IJ',
            rol_id: enpa._id
        }).save();

        //carga de los consejos populares
        consejos.features.forEach(item => {
            Consejo({
                nombre: item.properties.Nombre,
                habitantes: item.properties.Poblacion,
                location: {
                    type: 'Polygon',
                    coordinates: item.geometry.coordinates
                }
            }).save();
        });

        console.log('db filled!!!!');
    }

    return true;
}