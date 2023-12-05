import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { StateSelector, Store } from '../store/store';

@Provider()
export class BlackoutProvider {
    @Inject('Store')
    private store: Store;

    private isInBlackout: null | boolean = null;

    handleBlackoutChange() {
        const global = this.store.getState().global;
        const shouldBeInBlackout = global.blackout || global.blackoutLevel > 0;

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

    @StateSelector(state => state.global.blackout, state => state.global.blackoutLevel)
    async onBlackoutChange() {
        this.handleBlackoutChange();
    }

    @Once()
    onStart(): void {
        this.handleBlackoutChange();
        SetArtificialLightsStateAffectsVehicles(false);
    }
}
