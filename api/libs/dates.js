let dias = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
];

module.exports = {
    cantDaysMonth: (mes, anno) => {
        switch (mes) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            case 2:
                if (anno % 100 == 0)
                    if (anno % 400 == 0)
                        return 29;
                    else
                        return 28;
                else if (anno % 4 == 0)
                    return 29
                else
                    return 28;
        }
    }
}