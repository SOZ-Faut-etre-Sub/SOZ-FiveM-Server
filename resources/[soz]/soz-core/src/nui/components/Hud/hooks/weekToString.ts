export const weekToString = (dayOfWeek: number): string => {
    switch (dayOfWeek) {
        case 0:
            return 'Dim';
        case 1:
            return 'Lun';
        case 2:
            return 'Mar';
        case 3:
            return 'Mer';
        case 4:
            return 'Jeu';
        case 5:
            return 'Ven';
        case 6:
            return 'Sam';
        default:
            return '???';
    }
};
