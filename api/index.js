const express = require('express')
const consign = require("consign")
const bodyParser = require("body-parser")
// const middlewares = require("./libs/middlewares")

// Create express instance
const app = express()

// Init body-parser options (inbuilt with express)
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// middleware para verificar token
// app.use(middlewares.verifyToken);


// consign({
//         cwd: __dirname
//     })
//     .include('./db.js')
//     .then('./models')
//     .then('./controllers')
//     .then('./routes')
//     .into(app);


module.exports = app

// Start standalone server if directly running
if (require.main === module) {
    const port = process.env.PORT || 3001
    app.listen(port, () => {
        console.log(`API server listening on port ${port}`)
    })
}
