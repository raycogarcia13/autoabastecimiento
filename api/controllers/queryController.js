const mongoose = require('mongoose');
let asyncForEach = require("../libs/asyncForEach")


module.exports = app => {
    const Demanda = mongoose.model('Demanda');
    const Captador = mongoose.model('Captador');
    const Tipo = mongoose.model('Tipo');
    return {
        plan_real: async(req, res) => {
            let dt = new Date();
            let fecha = null;
            if (req.body.limit == "mes") {
                fecha = dt.getFullYear() + '-' + parseInt(dt.getMonth() + 1) + '-' + 1
            } else
                fecha = dt.getFullYear() + '-1-1';

            let tipos = await Tipo.find();
            let dplan = await Demanda.find({ fecha: { $gte: fecha }, activo: true })
                .populate('demandas.tipo_id', 'nombre');

            let plan = {};
            await asyncForEach(tipos, async(item) => {
                plan[item.nombre] = 0;
            })
            await asyncForEach(dplan, async(item) => {
                await asyncForEach(item.demandas, async(dem) => {
                    plan[dem.tipo_id.nombre] += parseFloat(dem.demanda);
                })
            });

            await asyncForEach(tipos, async(item) => {
                plan[item.nombre] = plan[item.nombre] / 2200;
            })
            let real = {};

            let captdata = await Captador.find({
                fechad: { $gte: fecha }
            }).populate('comercializadora_id', 'nombre');

            await asyncForEach(tipos, async(item) => {
                real[item.nombre] = 0;
            })

            await asyncForEach(captdata, async(item) => {
                await asyncForEach(tipos, async(tipo) => {
                    await asyncForEach(item[tipo.nombre], async(capt) => {
                        real[tipo.nombre] += parseFloat(capt.cant);
                    });
                })
            })

            await asyncForEach(tipos, async(item) => {
                real[item.nombre] = real[item.nombre] / 1000;
            })

            return res.json({ fecha, plan, real, demandas: dplan, captador: captdata });
        }
    }

}