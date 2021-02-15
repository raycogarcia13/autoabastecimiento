const mongoose = require('mongoose');
let asyncForEach = require("../libs/asyncForEach")
let { cantDaysMonth } = require("../libs/dates")


module.exports = app => {
    const Demanda = mongoose.model('Demanda');
    const Captador = mongoose.model('Captador');
    const Tipo = mongoose.model('Tipo');
    const Consejo = mongoose.model('Consejo');

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
                plan[item.nombre] = (plan[item.nombre] / (2.1739 * 1000)).toFixed(2);
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
                real[item.nombre] = (real[item.nombre] / 1000).toFixed(2);
            })

            return res.json({ fecha, plan, real, demandas: dplan, captador: captdata });
        },

        demandaMes: async(req, res) => {
            let dplan = await Demanda.find({ activo: true })
                .populate('demandas.tipo_id', 'nombre')
                .populate('consejo_id', 'nombre');

            let data = [];
            await asyncForEach(dplan, async(item) => {
                let d = {
                    consejo: item.consejo_id.nombre,
                    habitantes: item.habitantes,
                    Viandas: 0,
                    Hortalizas: 0,
                    Frutales: 0,
                    Granos: 0,
                    Proteinas: 0,
                };
                await asyncForEach(item.demandas, async(dem) => {
                    if (dem.tipo_id.nombre == 'Proteinas')
                        d[dem.tipo_id.nombre] = (dem.demanda / 1000).toFixed(2);
                    else
                        d[dem.tipo_id.nombre] = (dem.demanda / (2.1739 * 1000)).toFixed(2);
                });

                data.push(d);
            });

            res.json({ msg: "success", data: data })
        },

        demandaDia: async(req, res) => {
            let dplan = await Demanda.find({ activo: true })
                .populate('demandas.tipo_id', 'nombre')
                .populate('consejo_id', 'nombre');

            let fecha = new Date();
            // cantDaysMonth
            let dias = cantDaysMonth(fecha.getMonth() + 1, fecha.getFullYear());
            let data = [];
            await asyncForEach(dplan, async(item) => {
                let d = {
                    consejo: item.consejo_id.nombre,
                    habitantes: item.habitantes,
                    Viandas: 0,
                    Hortalizas: 0,
                    Frutales: 0,
                    Granos: 0,
                    Proteinas: 0,
                };
                await asyncForEach(item.demandas, async(dem) => {
                    if (dem.tipo_id.nombre == 'Proteinas')
                        d[dem.tipo_id.nombre] = ((dem.demanda / 1000) / dias).toFixed(2);
                    else
                        d[dem.tipo_id.nombre] = ((dem.demanda / (2.1739 * 1000)) / dias).toFixed(2);
                });

                data.push(d);
            });

            res.json({ msg: "success", data: data, fecha: { date: fecha, dias } })
        },

        acomuladoMes: async(req, res) => {
            let dt = new Date();
            let fecha = dt.getFullYear() + '-' + parseInt(dt.getMonth() + 1) + '-' + 1
            let tipos = await Tipo.find();
            let consejosData = await Consejo.find();

            let data = [];
            await asyncForEach(consejosData, async(item) => {
                let cnsj = {
                    nombre: item.nombre,
                    id: item._id,
                };
                await asyncForEach(tipos, t => {
                    cnsj[t.nombre] = 0;
                })
                data.push(cnsj);
            });

            let captdata = await Captador.find({ fechad: { $gte: fecha } })
                .populate('comercializadora_id', 'consejo_id');

            await asyncForEach(captdata, async(item) => {
                await asyncForEach(data, async(cnsj, j, all) => {
                    if (cnsj.id == '' + item.comercializadora_id.consejo_id + '') {
                        await asyncForEach(tipos, async(tip) => {
                            let suma = 0;
                            asyncForEach(item[tip.nombre], s => { suma += parseFloat(s.cant) });
                            data[j][tip.nombre] += parseFloat(suma);
                        });
                    }
                })
            })

            await asyncForEach(data, async(item, i) => {
                await asyncForEach(tipos, async(tip) => {
                    if (tip.nombre == 'Proteinas')
                        data[i][tip.nombre] = (parseFloat(item[tip.nombre] / 1000)).toFixed(2);
                    else
                        data[i][tip.nombre] = (parseFloat(item[tip.nombre] / (2.1739 * 1000))).toFixed(2);
                });
            });

            res.json({ msg: "success", data: data, fecha: new Date(fecha) })
            return res.json({ data });
        },
        cumplimento: async(req, res) => {
            let tipo = await Tipo.findById(req.params.tipo);
            let fecha = new Date();

            let demData = await Demanda.find({ activo: true });



            res.json({ tipo, fecha, data: demData })
        }
    }

}