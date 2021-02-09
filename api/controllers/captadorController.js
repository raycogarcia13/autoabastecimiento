const mongoose = require('mongoose');
const moment = require('moment');
module.exports = app => {
    const Productos = mongoose.model('Cultivos');
    const Tipos = mongoose.model('Tipo');
    const Captador = mongoose.model('Captador');

    return {
        index: async(req, res) => {
            let all = [];

            if (!req.body.punto)
                return res.json({ status: 'failed', msg: 'no data' });

            let tipos = await Tipos.find();

            let fecha = new Date(Date.parse(req.body.fecha));
            let dia = fecha.getDate();
            let mes = fecha.getMonth() + 1;
            let anno = fecha.getFullYear();
            fecha = { dia, mes, anno }

            let datas = await Captador.find({ fecha, comercializadora_id: req.body.punto });

            for (let i = 0; i < tipos.length; i++) {
                let item = tipos[i];
                let prod = await Productos.find({ tipo_id: item._id });
                let p = [];
                for (let j = 0; j < prod.length; j++) {
                    let cant = 0
                    let pi = prod[j];
                    await datas.forEach(async c => {
                        let tmp = c[item.nombre];
                        await tmp.forEach(async tp => {
                            if ('"' + tp.producto_id + '"' == '"' + pi._id + '"')
                                cant = tp.cant;

                        })
                    });
                    p.push({
                        id: pi._id,
                        nombre: pi.nombre,
                        cant: cant
                    })
                }
                all.push({
                    'tipo': {
                        id: item._id,
                        nombre: item.nombre
                    },
                    'productos': p
                });
            }

            // return res.json({ fecha: dia, mes: mes, anno: anno })


            // return res.json({ status: 'success', data: datas });
            return res.json({ status: 'success', data: all });
        },
        store: async(req, res) => {

            let obj = {
                cant: req
            }

            return res.json(req.body)
        }
    }

}