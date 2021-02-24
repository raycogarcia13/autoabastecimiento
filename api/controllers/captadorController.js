const mongoose = require('mongoose');
const asyncForEach = require('../libs/asyncForEach');
module.exports = app => {
    const Productos = mongoose.model('Cultivos');
    const Tipos = mongoose.model('Tipo');
    const Captador = mongoose.model('Captador');
    const Puntos = mongoose.model('Comercializadora');

    return {
        index: async(req, res) => {
            let all = [];

            if (!req.body.punto)
                return res.json({ status: 'failed', msg: 'no data' });

            let tipos = await Tipos.find();

            let fecha = new Date(Date.parse(req.body.fecha));
            let dia = fecha.getDate() + 1;
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
                        cant: cant,
                        type: item.nombre
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

            return res.json({ status: 'success', data: all });
        },
        store: async(req, res) => {

            let fecha = new Date(Date.parse(req.body.date));
            let dia = fecha.getDate() + 1;
            let mes = fecha.getMonth() + 1;
            let anno = fecha.getFullYear();
            let fecha2 = Date.parse(req.body.date);
            fecha = { dia, mes, anno }

            let data = await Captador.findOne({ fecha, comercializadora_id: req.body.unidad });
            if (data) {

                let dtype = data[req.body.type];
                let find = false;
                for (let i = 0; i < dtype.length; i++) {
                    let item = dtype[i];
                    if (item.producto_id == req.body.id) {
                        find = true;
                        data[req.body.type][i].cant = req.body.cant;
                        break;
                    }
                }
                if (find) {
                    data.save();
                } else {
                    data[req.body.type].push({
                        producto_id: req.body.id,
                        cant: req.body.cant
                    });
                    data.save();

                }

                return res.json(data)
            }

            //sino existe lo creo
            data = Captador({
                fecha,
                fechad: fecha2,
                comercializadora_id: req.body.unidad,
            });
            data[req.body.type].push({
                producto_id: req.body.id,
                cant: req.body.cant
            });

            data.save();
            return res.json({ status: "success", data: data });

        },

        noCaptan: async(req, res) => {

            let fecha = new Date(Date.parse(req.body.fecha));
            let dia = fecha.getDate() + 1;
            let mes = fecha.getMonth() + 1;
            let anno = fecha.getFullYear();
            fecha = { dia, mes, anno }

            let all = await Puntos.find()
                .populate('consejo_id', 'nombre')
                .populate('basep_id', 'nombre');
            let datas = await Captador.find({ fecha });

            await asyncForEach(all, async(item, i) => {
                let exist = datas.find(comr => comr.comercializadora_id == '' + item._id + '');
                if (exist) {
                    all.splice(i, 1);
                }
            })

            return res.json({ count: all.length, all });
        }
    }

}