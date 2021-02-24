let dias = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
];

let meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
];

let dayIsCount = (dt) => {
    let fecha = new Date(dt);
    let d = fecha.getDay();
    let cant;
    switch (d) {
        case 1:
            cant = 0;
            break;
        default:
            cant = 1;
            break;
    }
    return cant;
}

let cantDaysMonth = (mes, anno) => {
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

module.exports = {
    cantDaysMonth,
    diasHabiles: (mes, anno) => {
        let cantMont = cantDaysMonth(mes, anno);
        if (!cantMont)
            return null;
        let cant = 0;
        for (let i = 1; i <= cantMont; i++) {
            let date = new Date(anno + '/' + mes + '/' + i);
            cant += dayIsCount(date);
        }
        return cant;
    },
    getMes: (mes) => {
        return meses[mes];
    }

}