const mongoose = require('mongoose');
let asyncForEach = require("../libs/asyncForEach")

module.exports = app => {
    const Productos = mongoose.model('Cultivos');
    const Tipos = mongoose.model('Tipo');
    const Produccion = mongoose.model('Produccion');

    return {
        index: async(req, res) => {

            let mes = parseInt(req.params.mes);
            let anno = parseInt(req.params.anno);
            let fecha = { mes, anno }

            let datas = await Produccion.findOne({ fecha });
            let tipos = await Tipos.find();

            let all = [];
            await asyncForEach(tipos, async(tipo) => {
                let obj = {
                    nombre: tipo.nombre,
                    id_tipo: tipo._id,
                    total_prod: 0,
                    total_rat: 0,
                    producciones: []
                }
                let productos = await Productos.find({ tipo_id: tipo._id });

                await asyncForEach(productos, async(producto) => {
                    let prod = {
                        id: producto._id,
                        producto: producto.nombre,
                        siembra: 0,
                        ratificado: 0
                    }

                    let pdia = null;
                    if (datas)
                        pdia = await datas.producciones.find(it => it.producto_id == '' + producto._id + '');

                    if (pdia) {
                        prod.siembra = pdia.siembra;
                        prod.ratificado = pdia.ratificado;
                    }
                    obj.total_prod += prod.siembra;
                    obj.total_rat += prod.ratificado;
                    obj.producciones.push(prod);
                })
                all.push(obj);
            })


            return res.json({ status: 'success', data: all, fecha });
        },

        store: async(req, res) => {

            let mes = parseInt(req.body.mes);
            let anno = parseInt(req.body.anno);
            let fecha = { mes, anno }
            let id = req.body.id;
            let siembra = req.body.siembra;
            let ratificado = req.body.ratificado;

            let data = await Produccion.findOne({ fecha });

            if (data) {
                let find = false;
                await asyncForEach(data.producciones, async(item, i) => {
                    if (item.producto_id == '' + id + '') {
                        find = true;
                        data.producciones[i].siembra = parseFloat(siembra);
                        data.producciones[i].ratificado = parseFloat(ratificado);
                        data.save();
                    }
                })
                if (!find) {
                    data.producciones.push({
                        producto_id: id,
                        siembra: siembra ? siembra : 0,
                        ratificado: ratificado ? ratificado : 0
                    })

                    data.save();
                }

                return res.json(data)

            } else {
                let prod = Produccion({
                    fecha,
                    fechad: (new Date(anno + '/' + mes + '/1')),
                    producciones: []
                });

                prod.producciones.push({
                    producto_id: id,
                    siembra: siembra ? siembra : 0,
                    ratificado: ratificado ? ratificado : 0
                })

                prod.save();

                return res.json(prod)
            }

        }

    }

}