import { Once } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { StateBagHandler } from '../../core/decorators/state';

@Provider()
export class BlackoutProvider {
    @StateBagHandler('blackout', 'global')
    onBlackoutChange(_name, _key, value: boolean): void {
        if (value) {
            TriggerEvent('InteractSound_CL:PlayOnOne', 'system/blackout', 0.2);
        } else {
            TriggerEvent('InteractSound_CL:PlayOnOne', 'system/unblackout', 0.2);
        }

        SetArtificialLightsState(value);
    }

    @Once()
    onStart(): void {
        SetArtificialLightsState(GlobalState.blackout);
        SetArtificialLightsStateAffectsVehicles(false);
    }
}
