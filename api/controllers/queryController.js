const mongoose = require('mongoose');
let asyncForEach = require("../libs/asyncForEach")
let { cantDaysMonth, diasHabiles } = require("../libs/dates")


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
                if (item.nombre == 'Proteinas')
                    plan[item.nombre] = ((plan[item.nombre] / 1000)).toFixed(2);
                else
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
            // let dias = cantDaysMonth(fecha.getMonth() + 1, fecha.getFullYear());
            let dias = diasHabiles(fecha.getMonth() + 1, fecha.getFullYear());
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
                    // if (tip.nombre == 'Proteinas')
                    data[i][tip.nombre] = (parseFloat(item[tip.nombre] / 1000)).toFixed(2);
                    // else
                    // data[i][tip.nombre] = (parseFloat(item[tip.nombre] / (2.1739 * 1000))).toFixed(2);
                });
            });

            let demData = await Demanda.find({ activo: true })
                .populate('demandas.tipo_id', 'nombre')
                .populate('consejo_id', 'nombre');

            await asyncForEach(data, async(item, i) => {
                for (let j = 0; j < demData.length; j++) {
                    if (item.nombre == demData[j].consejo_id.nombre) {
                        await asyncForEach(demData[j].demandas, async(dem) => {

                            let plan = 0;
                            if (dem.tipo_id.nombre == 'Proteinas')
                                plan = (parseFloat(dem.demanda / 1000)).toFixed(2);
                            else
                                plan = (parseFloat(dem.demanda / (2.1739 * 1000))).toFixed(2);

                            data[i]['plan_' + dem.tipo_id.nombre] = plan;
                            data[i]['indice_' + dem.tipo_id.nombre] = dem.indice;
                        })
                    }
                }
            })

            let final = [];
            await asyncForEach(data, item => {
                let tmp = {
                    nombre: item.nombre,
                    Viandas: ((parseFloat(item.Viandas) * item.indice_Viandas) / parseFloat(item.plan_Viandas)).toFixed(2),
                    Hortalizas: ((parseFloat(item.Hortalizas) * item.indice_Hortalizas) / parseFloat(item.plan_Hortalizas)).toFixed(2),
                    Granos: ((parseFloat(item.Granos) * item.indice_Hortalizas) / parseFloat(item.plan_Hortalizas)).toFixed(2),
                    Frutales: ((parseFloat(item.Frutales) * item.indice_Hortalizas) / parseFloat(item.plan_Hortalizas)).toFixed(2),
                    Proteinas: ((parseFloat(item.Proteinas) * item.indice_Hortalizas) / parseFloat(item.plan_Hortalizas)).toFixed(2),
                }
                final.push(tmp);
            })

            // res.json({ msg: "success", data: data, fecha: new Date(fecha) })
            return res.json({ msg: "success", data: final, fecha: new Date(fecha) })
        },
        cumplimento: async(req, res) => {
            let fecha = new Date();
            let dias = diasHabiles(fecha.getMonth() + 1, fecha.getFullYear());
            let tipo = await Tipo.findById(req.params.tipo);
            let demData = await Demanda.find({ activo: true })
                .populate('consejo_id', 'nombre');

            let data = [];
            await asyncForEach(demData, async(item) => {
                let res = {
                    id: item.consejo_id._id,
                    consejo: item.consejo_id.nombre,
                    plan_ac: 0,
                    real_ac: 0,
                    perc_ac: 0,
                    plan_dia: 0,
                    real_dia: 0,
                    plan_mes: 0,
                    perc_dia: 0
                }
                let plan = 0;
                let it = item.demandas;
                for (let i = 0; i < it.length; i++)
                    if (it[i].tipo_id == '' + tipo._id + '') {
                        plan = it[i].demanda;
                        break;
                    }
                plan = (tipo.nombre == 'Proteinas') ? parseFloat(plan) / 1000 : parseFloat(plan) / (2.1739 * 1000);
                res.plan_mes = plan.toFixed(2);
                res.plan_ac = ((parseFloat(plan) / dias) * fecha.getDate()).toFixed(2);
                res.plan_dia = ((parseFloat(plan) / dias)).toFixed(2);

                data.push(res);
            })


            fecha = fecha.getFullYear() + '-' + parseInt(fecha.getMonth() + 1) + '-' + parseInt(fecha.getDate() - 1)
            let captDay = await Captador.find({
                fechad: { $gte: fecha }
            }).populate('comercializadora_id', ['nombre', 'consejo_id']);
            await asyncForEach(captDay, async(capt) => {
                    let con_id = capt.comercializadora_id.consejo_id;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id == '' + con_id + '') {
                            let suma = 0;
                            await asyncForEach(capt[tipo.nombre], async(c) => {
                                suma += c.cant
                            })
                            suma = (tipo.nombre == 'Proteinas') ? parseFloat(suma) / 1000 : parseFloat(suma) / (2.1739 * 1000);
                            data[i].real_dia += suma;
                            break;
                        }
                    }
                })
                // let real = {};
            fecha = new Date();
            fecha = fecha.getFullYear() + '-' + parseInt(fecha.getMonth() + 1) + '-' + 1;
            let captData = await Captador.find({
                fechad: { $gte: fecha }
            }).populate('comercializadora_id', ['nombre', 'consejo_id']);
            await asyncForEach(captData, async(capt) => {
                let con_id = capt.comercializadora_id.consejo_id;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id == '' + con_id + '') {
                        let suma = 0;
                        await asyncForEach(capt[tipo.nombre], async(c) => {
                            suma += c.cant
                        })
                        suma = (tipo.nombre == 'Proteinas') ? parseFloat(suma) / 1000 : parseFloat(suma) / (2.1739 * 1000);
                        data[i].real_ac += suma;
                        break;
                    }
                }
            })

            await asyncForEach(data, async(item, i) => {
                data[i].real_ac = parseFloat(item.real_ac).toFixed(2);
                data[i].real_dia = parseFloat(item.real_dia).toFixed(2);
                data[i].perc_ac = ((item.real_ac / item.plan_ac) * 100).toFixed(2);
                data[i].perc_dia = ((item.real_dia / item.plan_dia) * 100).toFixed(2);
            })



            res.json({ msg: 'success', data })
        }
    }

}