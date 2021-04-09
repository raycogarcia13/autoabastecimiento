const express = require('express')
const consign = require("consign")
const bodyParser = require("body-parser")
const middlewares = require("./libs/middlewares")
var https = require('https')
var http = require('http')

// Create express instance
const app = express()

// Init body-parser options (inbuilt with express)
app.use(express.json({ limit: '100mb' }));
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));

// middleware para verificar token
app.use(middlewares.verifyToken);


consign({
        cwd: __dirname
    })
    .include('./db/db.js')
    .then('./models')
    .include('./db/migrate.js')
    .then('./controllers')
    .then('./routes')
    .into(app);


module.exports = app

// Start standalone server if directly running
if (require.main === module) {
    const port = process.env.PORT || 3001
    app.listen(port, () => {
        console.log(`API server listening on port ${port}`)
    })
}