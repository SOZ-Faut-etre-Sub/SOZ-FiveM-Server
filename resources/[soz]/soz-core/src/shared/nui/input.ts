import { Err, Ok, Result } from '@public/shared/result';

export interface NuiInputMethodMap {
    AskInput: AskInput;
    InInput: boolean;
}

export type AskInput = {
    title: string;
    defaultValue?: string;
    maxCharacters?: number;
};

export type ValidateInput<T> = (input: string) => Result<T, string>;

export const NotEmptyStringValidator: ValidateInput<string> = (input: string) => {
    if (input?.trim() === '') {
        return Err('Veuillez entrer une valeur');
    }

    return Ok(input);
};

export const PositiveNumberValidator: ValidateInput<number> = (input: string) => {
    const inputNumber = Number(input);

    if (isNaN(inputNumber) || inputNumber < 0) {
        return Err('Veuillez entrer un nombre positif');
    }

    if (inputNumber % 1 !== 0) {
        return Err(`La valeur doit être un nombre entier.`);
    }

    return Ok(inputNumber);
};

export const NumberValidator: ValidateInput<number> = (input: string) => {
    const inputNumber = Number(input);

    if (isNaN(inputNumber)) {
        return Err('Veuillez entrer un nombre');
    }

    return Ok(inputNumber);
};

export const NumberValidatorFactory = (min?: number, max?: number): ValidateInput<number> => {
    return (input: string) => {
        const inputNumber = Number(input);

        if (isNaN(inputNumber)) {
            return Err(`Veuillez entrer un nombre.`);
        }

        if (min && inputNumber < min) {
            return Err(`La valeur doit être supérieure ou égale à ${min}.`);
        }

        if (max && inputNumber > max) {
            return Err(`La valeur doit être inférieure ou égale à ${max}.`);
        }

        if (inputNumber % 1 !== 0) {
            return Err(`La valeur doit être un nombre entier.`);
        }

        return Ok(inputNumber);
    };
};

export const HttpLinkValidator: ValidateInput<string> = (input: string) => {
    if (input?.trim() === '') {
        return Err('Veuillez entrer une adresse URL');
    }
    const trimmed = input?.trim() ?? '';
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        return Err('L’URL doit commencer par "http://" ou "https://"');
    }
    return Ok(input);
};
