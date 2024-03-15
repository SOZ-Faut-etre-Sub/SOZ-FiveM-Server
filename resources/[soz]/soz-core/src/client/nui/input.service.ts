import { wait } from '@core/utils';

import { OnNuiEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent } from '../../shared/event';
import { AskInput, PositiveNumberValidator, ValidateInput } from '../../shared/nui/input';
import { Err, isErr, Ok, Result } from '../../shared/result';
import { NuiDispatch } from './nui.dispatch';

@Provider()
export class InputService {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    private currentInputResolve = null;

    private currentInputValidate: ValidateInput<any> | null = null;

    public async askInput<T = string>(input: AskInput, validate: ValidateInput<T> | null = null): Promise<T | null> {
        const promise = new Promise<T>(resolve => {
            this.currentInputResolve = resolve;
        });

        this.currentInputValidate = validate || (input => Ok(input));

        this.nuiDispatch.dispatch('input', 'AskInput', input);
        this.nuiDispatch.dispatch('input', 'InInput', true);

        const value = await promise;

        this.nuiDispatch.dispatch('input', 'InInput', false);

        await wait(100);

        return value;
    }

    public async askConfirm(title: string): Promise<boolean> {
        const confirm = await this.askInput<boolean>(
            {
                title,
                defaultValue: '',
                maxCharacters: 3,
            },
            input => {
                if (input && (input.toLowerCase() === 'oui' || input.toLowerCase() === 'non')) {
                    return Ok(input.toLowerCase() === 'oui');
                }

                return Err('Vous devez écrire "oui" ou "non" pour confirmer');
            }
        );

        if (confirm === null) {
            return false;
        }

        return confirm;
    }

    @Exportable('Input')
    public async askInputLegacy(title: string, maxCharacters: number, defaultValue: string): Promise<string> {
        return this.askInput({
            title,
            maxCharacters,
            defaultValue,
        });
    }

    @OnNuiEvent(NuiEvent.InputCancel)
    public async cancelInput(): Promise<void> {
        if (this.currentInputResolve) {
            this.currentInputResolve(null);
        }

        this.currentInputValidate = null;
        this.currentInputResolve = null;
    }

    @OnNuiEvent(NuiEvent.InputSet)
    public async onInput(input: string): Promise<Result<any, string>> {
        if (this.currentInputValidate) {
            const result = this.currentInputValidate(input);

            if (isErr(result)) {
                return result;
            }

            this.currentInputResolve(result.ok);
        } else {
            this.currentInputResolve(input);
        }

        this.currentInputValidate = null;
        this.currentInputResolve = null;

        return Ok(null);
    }

    @OnNuiEvent(NuiEvent.AskInput)
    public async askNuiInput(input: AskInput) {
        return this.askInput(input);
    }

    @OnNuiEvent(NuiEvent.AskInputNumber)
    public async askNuiInputNumber(input: AskInput) {
        return this.askInput(input, PositiveNumberValidator);
    }
}
