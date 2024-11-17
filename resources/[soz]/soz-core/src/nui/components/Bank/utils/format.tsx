import cn from 'classnames';
import { ReactNode } from 'react';

export const PlayerAccountRegExp = /^[0-9]{3}Z[0-9]{4}T[0-9]{3}$/;

export const FORMAT_CURRENCY: Intl.NumberFormatOptions = {
    style: 'decimal',
    currency: 'USD',
    maximumFractionDigits: 0,
};

export const moneyFormat = (money: number, useColor = true): ReactNode => {
    return (
        <>
            <span
                className={cn({
                    'text-green-500/70': useColor && money > 0,
                    'text-red-500/70': useColor && money <= 0,
                })}
            >
                $
            </span>
            {money?.toLocaleString('en-US', FORMAT_CURRENCY)}
        </>
    );
};

export const inputErrorMessage = (type: string): string => {
    switch (type) {
        case 'required':
            return 'Le champ est requis';
        case 'min':
            return 'Le montant doit être supérieur à 0';
        case 'max':
            return "Vous n'avez pas autant d'argent";
        case 'minLength':
            return 'Le champ doit contenir plus de caractères';
        case 'maxLength':
            return 'Le champ doit contenir moins de caractères';
    }
};
