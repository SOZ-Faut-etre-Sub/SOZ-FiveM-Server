import { Once } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { StateBagHandler } from '../../core/decorators/state';

@Provider()
export class BlackoutProvider {
    private blackout = false;
    private blackoutLevel = 0;
    private isInBlackout: null | boolean = null;

    handleBlackoutChange() {
        const shouldBeInBlackout = this.blackout || this.blackoutLevel > 0;

        if (shouldBeInBlackout !== this.isInBlackout) {
            if (shouldBeInBlackout) {
                TriggerEvent('InteractSound_CL:PlayOnOne', 'system/blackout', 0.2);
            } else {
                TriggerEvent('InteractSound_CL:PlayOnOne', 'system/unblackout', 0.2);
            }

            SetArtificialLightsState(shouldBeInBlackout);
            this.isInBlackout = shouldBeInBlackout;
        }
    }

    @StateBagHandler('blackout', 'global')
    async onBlackoutChange(_name, _key, value: boolean) {
        this.blackout = value;
        this.handleBlackoutChange();
    }

    @StateBagHandler('blackout_level', 'global')
    async onBlackoutLevelChange(_name: string, _key: string, value: number) {
        this.blackoutLevel = value;
        this.handleBlackoutChange();
    }

    @Once()
    onStart(): void {
        this.blackout = GlobalState.blackout || false;
        this.blackoutLevel = GlobalState.blackout_level || 0;

        this.handleBlackoutChange();
        SetArtificialLightsStateAffectsVehicles(false);
    }
}
