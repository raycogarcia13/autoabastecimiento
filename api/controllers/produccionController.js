const mongoose = require('mongoose');
let asyncForEach = require("../libs/asyncForEach")

module.exports = app => {
    const Productos = mongoose.model('Cultivos');
    const Tipos = mongoose.model('Tipo');
    const Produccion = mongoose.model('Produccion');

    return {
        index: async(req, res) => {

            let mes = req.params.mes;
            let anno = req.params.anno;
            let fecha = { mes, anno }

            let datas = await Produccion.find({ fecha });
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
                    let pdia = await datas.find(it => it.producto_id == '' + producto._id + '');
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

    }

}