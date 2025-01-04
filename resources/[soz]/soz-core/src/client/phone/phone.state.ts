import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { StateSelector } from '@public/client/store/store';

@Provider()
export class PhoneState {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    private phoneDisabled = false;
    private phoneOpen = false;
    private phoneDrowned = false;
    private cityIsInBlackOut = false;

    public isPhoneDisabled() {
        return this.cityIsInBlackOut || this.phoneDisabled;
    }

    public isPhoneDrowned() {
        return this.phoneDrowned;
    }

    public isPhoneOpen() {
        return this.phoneOpen;
    }

    public setPhoneOpen(value: boolean) {
        this.phoneOpen = value;
        this.nuiDispatch.dispatch('phone', 'SetVisibility', value);
    }

    @StateSelector(state => state.global.blackout, state => state.global.blackoutLevel)
    async onBlackout(blackout: boolean, blackoutLevel: number) {
        this.cityIsInBlackOut = blackout || blackoutLevel >= 3;
    }
}
