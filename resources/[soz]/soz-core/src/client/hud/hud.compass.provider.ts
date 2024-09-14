import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { HudCompass } from '../../shared/hud';
import { Vector3 } from '../../shared/polyzone/vector';
import { NuiDispatch } from '../nui/nui.dispatch';
import { HudStateProvider } from './hud.state.provider';
import { HudWatchProvider } from './hud.watch.provider';

const degreesToCardinal = (degrees: number): HudCompass['cardinal'] => {
    const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as HudCompass['cardinal'][];
    const index = Math.round(degrees / 45);
    return cardinals[index % 8];
};

@Provider()
export class HudCompassProvider {
    @Inject(HudStateProvider)
    private readonly hudStateProvider: HudStateProvider;

    @Inject(HudWatchProvider)
    private readonly hudWatchProvider: HudWatchProvider;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Tick()
    public showCompassLoop(): void {
        if (!this.hudStateProvider.isComputedHudVisible) {
            return;
        }

        if (!this.hudWatchProvider.haveWatch) {
            return;
        }

        if (!this.hudWatchProvider.showCompass) {
            return;
        }

        const rotation = GetGameplayCamRot(0) as Vector3;
        const heading = 360 - ((Math.round(rotation[2]) + 360) % 360);

        this.nuiDispatch.dispatch('hud', 'UpdateCompass', {
            degree: heading,
            cardinal: degreesToCardinal(heading),
        });
    }
}
