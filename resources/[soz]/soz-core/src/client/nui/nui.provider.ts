import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { NuiEvent } from '../../shared/event';
import { FocusInput, SetFocusInput } from '../../shared/nui/focus';
import { NuiDispatch } from './nui.dispatch';

@Provider()
export class NuiProvider {
    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    private state: Record<string, FocusInput> = {};

    @OnNuiEvent(NuiEvent.SetFocusInput)
    public async onSetFocusInput(data: SetFocusInput) {
        if (data.focus) {
            this.state[data.id] = data.focus;
        } else {
            delete this.state[data.id];
        }

        this.computeFocusInput();

        return true;
    }

    @Tick(100)
    public async checkPauseMenu() {
        this.dispatcher.dispatch('global', 'PauseMenuActive', IsPauseMenuActive());
    }

    private computeFocusInput() {
        let keyboard = false;
        let cursor = false;

        for (const focus of Object.values(this.state)) {
            keyboard = keyboard || focus.keyboard;
            cursor = cursor || focus.cursor;
        }

        SetNuiFocus(keyboard, cursor);
    }
}
