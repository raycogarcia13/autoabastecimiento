// const mongoose = require('mongoose');
var FormData = require('form-data');
var qs = require('qs');
const axios = require('axios');
const config = require('../config/config');
const { from } = require('form-data');

module.exports = app => {

    return {
        getProductos: async(req, res) => {

            let all = [];

            let data_uri = config.SIPA_GETDATA_URI;
            let login = config.SIPA_LOGIN_URI;
            let logout = config.SIPA_LOGOUT_URI;

            // let form = FormData();
            // form.append('_username', 'dlgpiju');
            // form.append('_password', 'Yluis2021-*');

            const sipa = axios.create({
                timeout: 1000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    // 'Content-Type': 'multipart/form-data;charset=utf-8',
                    "Cache-Control": "no-cache"
                },
                crossdomain: true,
                maxRedirects: 0,
                withCredentials: true,
                credentials: 'same-origin',
            });

            let form = {
                '_username': 'dlgpiju',
                '_password': 'Yluis2021-*'
            };

            form = Object.keys(form).map(function(key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(form[key])
            }).join('&')
            console.log(form);
            await sipa.post('http://sipa21.minag.cu/login_check', form).then(response => {
                    return res.send(response.data)
                }).catch(err => {
                    // console.log("api Erorr: ", err.response)
                    return res.send(err.response.data)
                })
                // await axios.post(login, qs.stringify({
                //     _username: config.SIPA_USER,
                //     _password: config.SIPA_PASS + '1212',
                // }), {
                //     headers: {
                //         "Content-Type": "application/x-www-form-urlencoded",
                //     },
                // }).then(response => {
                //     return res.send(response.data)
                // }).catch(err => console.log("api Erorr: ", err.response))


            // let prodid = 5;
            // let form2 = qs.stringify({
            //     ano: 2021,
            //     vista: 'T',
            //     idproducto: prodid,
            //     idprovincia: 16,
            //     idmunicipio: 168
            // });

            // let data = await axios({
            //     method: 'post',
            //     url: data_uri,
            //     data: form2,
            //     headers: {
            //         "Cookie": cookie,
            //     },
            //     credentials: 'same-origin',
            //     withCredentials: true
            // }).catch(e => {
            //     console.log(e);
            // });

            // if (data.data) {
            //     return res.json(data.data);
            // } else
        },

    }

}