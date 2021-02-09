const { body } = require('express-validator')
const mongoose = require('mongoose');

const captadorValidationRules = () => {
    return [
        body('id', 'Falta el id del producto').isLength({ min: 1 }),
        body('cant', 'Inserte la cantidad de la venta').isLength({ min: 1 }),
        body('date', 'debe isnertar la fecha').isLength({ min: 1 }),
        body('cant', 'La cantidad debe ser un número').isNumeric(),
        body('date', 'La fecha debe ser un número').isNumeric(),
    ]
}

module.exports = {
    captadorValidationRules
}