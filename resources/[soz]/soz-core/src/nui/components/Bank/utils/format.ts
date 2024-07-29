export const FORMAT_CURRENCY: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
};

export const inputErrorMessage = (type: string): string => {
    switch (type) {
        case 'min':
            return 'Le montant doit être supérieur à 0';
        case 'max':
            return "Le montant doit être inférieur à l'argent disponible";
    }
};
