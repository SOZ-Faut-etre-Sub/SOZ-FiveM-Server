import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent } from '../../shared/event';
import { AskInput } from '../../shared/nui/input';
import { isErr, Ok, Result } from '../../shared/result';
import { NuiDispatch } from './nui.dispatch';

type ValidateInput = (input: string) => Result<any, string>;

@Provider()
export class InputService {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    private currentInputResolve = null;

    private currentInputValidate: ValidateInput | null = null;

    public async askInput(input: AskInput, validate: ValidateInput | null = null): Promise<string | null> {
        const promise = new Promise<string>(resolve => {
            this.currentInputResolve = resolve;
        });

        this.currentInputValidate = validate;

        this.nuiDispatch.dispatch('input', 'AskInput', input);
        this.nuiDispatch.dispatch('input', 'InInput', true);

        const value = await promise;

        this.nuiDispatch.dispatch('input', 'InInput', false);

        return value;
    }

    @OnNuiEvent(NuiEvent.InputCancel)
    public async cancelInput(): Promise<void> {
        if (this.currentInputValidate) {
            this.currentInputResolve(null);
        }

        this.currentInputValidate = null;
        this.currentInputResolve = null;
    }

    @OnNuiEvent(NuiEvent.InputSet)
    public async onInput(input: string): Promise<Result<any, string>> {
        if (!this.currentInputValidate) {
            return Ok(null);
        }

        if (this.currentInputValidate) {
            const result = this.currentInputValidate(input);

            if (isErr(result)) {
                return result;
            }
        }

        this.currentInputResolve(input);

        this.currentInputValidate = null;
        this.currentInputResolve = null;

        return Ok(null);
    }
}
