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
    if (input.trim() === '') {
        return Err('Veuillez entrer une valeur');
    }

    return Ok(input);
};

export const PositiveNumberValidator: ValidateInput<number> = (input: string) => {
    const inputNumber = Number(input);

    if (isNaN(inputNumber) || inputNumber < 0) {
        return Err('Veuillez entrer un nombre positif');
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
