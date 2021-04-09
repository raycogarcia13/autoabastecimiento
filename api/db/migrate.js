const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

module.exports = async(app) => {

    const Rol = mongoose.model('Rol');

    let roles = await Rol.find()
    if (!roles.length) {
        let tipos = require("../datas/tipos")
        let consejos = require("../datas/consejosP")
        let puntos = require("../datas/puntosv")
        let unidades = require("../datas/unidades")
        let asyncForEach = require("../libs/asyncForEach")

        const User = mongoose.model('User');
        const Consejo = mongoose.model('Consejo');
        const Tipos = mongoose.model('Tipo');
        const Producto = mongoose.model('Cultivos');
        const Unidad = mongoose.model('Basesp');
        const Comerc = mongoose.model('Comercializadora');
        const Capt = mongoose.model('Captador');
        const Demanda = mongoose.model('Demanda');
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

        await asyncForEach(unidades.features, async(item) => {
            let tmp = await Unidad({
                nombre: item.properties.Nomb_UP,
                tipo: item.properties.Tipo_BP,
                location: {
                    type: item.geometry.type,
                    coordinates: item.geometry.coordinates
                }
            }).save();
            basesProductivas.push(tmp)
        });

        //carga de los consejos populares
        let allConsejos = []
        await asyncForEach(consejos.features, async(item) => {

            let cnsj = await Consejo({
                nombre: item.properties.nombre,
                habitantes: item.properties.habitantes,
                location: {
                    type: 'Polygon',
                    coordinates: item.geometry.coordinates
                }
            }).save();

            allConsejos.push(cnsj);
            await asyncForEach(puntos.features, async(item2) => {
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
        let allTipos = [];
        await asyncForEach(tipos, async(item) => {
            let t = await Tipos({
                nombre: item.tipo,
                indice: item.cant
            }).save();
            allTipos.push(t);
            item.item.forEach(async p => {
                await Producto({
                    nombre: p,
                    tipo_id: t._id
                }).save();
            })
        });



        await asyncForEach(allConsejos, async(item) => {
            let dem = Demanda({
                habitantes: item.habitantes,
                consejo_id: item._id,
                demandas: []
            });

            asyncForEach(allTipos, async(type) => {
                dem.demandas.push({
                    indice: type.indice,
                    tipo_id: type._id,
                    demanda: parseFloat(type.indice) * parseFloat(item.habitantes)
                })
            })
            await dem.save()
        })

        console.log('db filled!!!!');
    }



    return true;
}