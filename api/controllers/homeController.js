const mongoose = require('mongoose');
const asyncForEach = require('../libs/asyncForEach');
let { cantDaysMonth, getMes } = require("../libs/dates")

module.exports = app => {
    const Audit = mongoose.model('Audit');
    const Tipo = mongoose.model('Tipo');
    const Captador = mongoose.model('Captador');
    const Demanda = mongoose.model('Demanda');

    return {
        audit: async(req, res) => {

            let data = await Audit.aggregate()
                .group({
                    "_id": "$username",
                    "fecha": { "$addToSet": "$date" },
                }).limit(10);

            return res.json(data)
        },

        librasPerCapita: async(req, res) => {
            let colors = {
                Viandas: 'brown',
                Hortalizas: 'green',
                Frutales: 'orange',
                Granos: 'black',
                Proteinas: 'red'
            }

            let dt = new Date();
            let dias = cantDaysMonth(dt.getMonth() + 1, dt.getFullYear());
            let fecha = (req.params.limit == 'mes') ? dt.getFullYear() + '-' + parseInt(dt.getMonth() + 1) + '-' + 1 : dt.getFullYear() + '-' + parseInt(dt.getMonth() + 1) + '-' + parseInt(dt.getDate() - 1);

            let data = {};

            let tipos = await Tipo.find();
            await asyncForEach(tipos, item => {
                data[item.nombre] = {
                    id: item._id,
                    tipo: item.nombre,
                    color: colors[item.nombre],
                    indice: item.indice,
                    total: 0,
                    demanda: 0,
                }
            })
            let hab = 0;
            let demandas = await Demanda.find({ activo: true }).populate('demandas.tipo_id', 'nombre');
            await asyncForEach(demandas, async(item) => {
                hab += parseInt(item.habitantes);
                await asyncForEach(item.demandas, async(dem) => {
                    data[dem.tipo_id.nombre].demanda += (req.params.limit == 'mes') ? parseFloat(dem.demanda) : parseFloat(dem.demanda) / dias;
                })
            })

            let ventas = await Captador.find({ fechad: { $gte: fecha } });

            let conv = 2.1739
            await asyncForEach(ventas, async(item) => {
                let sum = 0;
                await item.Viandas.forEach(it => { sum += parseFloat(it.cant); })
                data.Viandas.total += sum * conv;
                sum = 0;
                await item.Hortalizas.forEach(it => { sum += parseFloat(it.cant); })
                data.Hortalizas.total += sum * conv;
                sum = 0;
                await item.Frutales.forEach(it => { sum += parseFloat(it.cant); })
                data.Frutales.total += sum * conv;
                sum = 0;
                await item.Granos.forEach(it => { sum += parseFloat(it.cant); })
                data.Granos.total += sum * conv;
                sum = 0;
                await item.Proteinas.forEach(it => { sum += parseFloat(it.cant); })
                data.Proteinas.total += sum;
            })

            return res.json({ data });
        },

        tendencia: async(req, res) => {

            let dt = new Date();
            let fecha =
                (req.params.limit == 'mes') ?
                dt.getFullYear() + '-' + parseInt(dt.getMonth() + 1) + '-' + 1 :
                dt.getFullYear() + '-' + 1 + '-' + 1;

            let capt = await Captador.find({ fechad: { $gte: fecha } });
            let data = [];
            if (req.params.limit == 'mes') {
                for (let i = 1; i <= dt.getDate(); i++) {
                    let suma = 0;
                    await asyncForEach(capt, async(item) => {
                        if (item.fecha.dia == i) {
                            await item.Viandas.forEach(it => { suma += parseFloat(it.cant); })
                            await item.Hortalizas.forEach(it => { suma += parseFloat(it.cant); })
                            await item.Frutales.forEach(it => { suma += parseFloat(it.cant); })
                            await item.Granos.forEach(it => { suma += parseFloat(it.cant); })
                            await item.Proteinas.forEach(it => { suma += parseFloat(it.cant); })
                        }
                    })
                    data.push({
                        label: i,
                        value: suma / 5
                    })
                }
            } else {
                for (let i = 1; i <= dt.getMonth() + 1; i++) {
                    let suma = 0;
                    await asyncForEach(capt, async(item) => {
                        if (item.fecha.mes == i) {
                            await item.Viandas.forEach(it => { suma += parseFloat(it.cant); })
                            await item.Hortalizas.forEach(it => { suma += parseFloat(it.cant); })
                            await item.Frutales.forEach(it => { suma += parseFloat(it.cant); })
                            await item.Granos.forEach(it => { suma += parseFloat(it.cant); })
                            await item.Proteinas.forEach(it => { suma += parseFloat(it.cant); })
                        }
                    })
                    data.push({
                        label: getMes(i - 1),
                        value: suma / 5
                    })
                }
            }


            return res.json({ fecha, data })
        }
    }

}