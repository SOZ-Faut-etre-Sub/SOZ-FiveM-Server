export const FORMAT_CURRENCY: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
};

export const moneyFormat = (money: number): string => {
    return money.toLocaleString('en-US', FORMAT_CURRENCY);
};

export const inputErrorMessage = (type: string): string => {
    switch (type) {
        case 'required':
            return 'Le champ est requis';
        case 'min':
            return 'Le montant doit être supérieur à 0';
        case 'max':
            return "Le montant doit être inférieur à l'argent disponible";
    }
};
