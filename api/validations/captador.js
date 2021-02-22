const { body } = require('express-validator')

const captadorValidationRules = () => {
    return [
        body('cant', 'Inserte la cantidad de la venta').isLength({ min: 1 }),
        body('cant', 'La cantidad debe ser un número').isNumeric(),
        body('date', 'debe pasar la fecha').isLength({ min: 1 }),
        body('type', 'debe pasar el tipo de produto').isLength({ min: 1 }),
        body('id', 'debe pasar el id del producto').isLength({ min: 1 }),
        body('unidad', 'debe pasar el id del producto').isLength({ min: 1 })
    ]
}

module.exports = {
    captadorValidationRules
}