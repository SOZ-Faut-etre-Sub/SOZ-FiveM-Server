import { OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { OnceLoader } from '../../core/loader/once.loader';
import { NuiEvent } from '../../shared/event';
import { Control } from '../../shared/input';
import { FocusInput, SetFocusInput } from '../../shared/nui/focus';
import { NuiDispatch } from './nui.dispatch';

@Provider()
export class NuiProvider {
    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    private state: Record<string, FocusInput> = {};

    private keyboard = false;

    private cursor = false;

    private keepInput = false;

    private disabledControls: Partial<Record<Control, boolean>> = {};

    private disabledAllControls = false;

    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @OnNuiEvent(NuiEvent.Loaded)
    public async onLoaded() {
        this.onceLoader.trigger(OnceStep.NuiLoaded);
    }

    @OnNuiEvent(NuiEvent.TriggerServerEvent)
    public async onTriggerServerEvent({ event, args }) {
        TriggerServerEvent(event, ...args);
    }

    @OnNuiEvent(NuiEvent.TriggerClientEvent)
    public async onTriggerClientEvent({ event, args }) {
        TriggerEvent(event, ...args);
    }

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

    @Tick(0)
    public async disableCameraOnCursorFocus() {
        if (this.cursor) {
            DisableControlAction(0, Control.LookUpDown, true);
            DisableControlAction(0, Control.LookLeftRight, true);
        }

        for (const control of Object.keys(this.disabledControls)) {
            DisableControlAction(0, Number(control), true);
        }

        if (this.disabledAllControls) {
            DisableAllControlActions(0);
            EnableControlAction(0, Control.PushToTalk, true);
        }
    }

    private computeFocusInput() {
        this.keyboard = false;
        this.cursor = false;
        this.keepInput = false;
        this.disabledControls = {};
        this.disabledAllControls = false;

        for (const focus of Object.values(this.state)) {
            this.keyboard = this.keyboard || focus.keyboard;
            this.cursor = this.cursor || focus.cursor;
            this.keepInput = this.keepInput || focus.keepInput;

            for (const control of focus.disableKeepInputControls || []) {
                this.disabledControls[control] = true;
            }

            this.disabledAllControls = this.disabledAllControls || focus.disableAllControls;
        }

        SetNuiFocus(this.keyboard, this.cursor);
        SetNuiFocusKeepInput(this.keepInput);
    }
}
