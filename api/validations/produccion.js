const { body } = require('express-validator')

const produccionValidationRules = () => {
    return [
        body('mes', 'debe pasar el mes').isLength({ min: 1 }),
        body('anno', 'debe pasar el año').isLength({ min: 1 }),
    ]
}

module.exports = {
    produccionValidationRules
}