const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
let tipos = require("../datas/tipos")
let consejos = require("../datas/consejosP")
let puntos = require("../datas/puntosv")
let unidades = require("../datas/unidades")

module.exports = async(app) => {

    const Rol = mongoose.model('Rol');
    const User = mongoose.model('User');
    const Consejo = mongoose.model('Consejo');
    const Tipos = mongoose.model('Tipo');
    const Producto = mongoose.model('Cultivos');
    const Unidad = mongoose.model('Basesp');
    const Comerc = mongoose.model('Comercializadora');
    const Capt = mongoose.model('Captador');

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


        //carga unidades productivas
        let basesProductivas = [];

        async function fillBase(item) { await basesProductivas.push(item) };
        unidades.features.forEach(async item => {
            let tmp = await Unidad({
                nombre: item.properties.Nomb_UP,
                tipo: item.properties.Tipo_BP,
                location: {
                    type: item.geometry.type,
                    coordinates: item.geometry.coordinates
                }
            }).save();
            await fillBase(tmp);
        });

        //carga de los consejos populares
        consejos.features.forEach(async item => {
            let cnsj = await Consejo({
                nombre: item.properties.nombre,
                habitantes: item.properties.habitantes,
                location: {
                    type: 'Polygon',
                    coordinates: item.geometry.coordinates
                }
            }).save();

            puntos.features.forEach(async item2 => {
                // console.log(item.properties.id, item2.properties.Consejo);
                if (item2.properties.Consejo == item.properties.id) {
                    let basep = await Unidad.findOne({ nombre: item2.properties.Asociado });
                    await Comerc({
                        nombre: item2.properties.Name,
                        consejo_id: cnsj._id,
                        basep_id: basep._id,
                        location: {
                            type: item2.geometry.type,
                            coordinates: item2.geometry.coordinates
                        }
                    }).save()
                }
            })

        });

        //carga de los tipos y productos
        tipos.forEach(async(item) => {
            let t = await Tipos({
                nombre: item.tipo,
                indice: item.cant
            }).save();

            await item.item.forEach(p => {
                Producto({
                    nombre: p,
                    tipo_id: t._id
                }).save();
            })
        });


        console.log('db filled!!!!');
    }

    // Capt({
    //     comercializadora_id: '6021f92d15ac9d4f6932a36d',
    //     Viandas: [{
    //         producto_id: '6021f92d15ac9d4f6932a321',
    //         cant: 6,
    //         um: 'kg'
    //     }, {
    //         producto_id: '6021f92d15ac9d4f6932a322',
    //         cant: 8,
    //         um: 'kg'
    //     }]
    // }).save();


    return true;
}