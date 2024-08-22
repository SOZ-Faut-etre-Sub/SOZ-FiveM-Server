import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { NuiDispatch } from '../nui/nui.dispatch';
import { HudStateProvider } from './hud.state.provider';
import { HudWatchProvider } from './hud.watch.provider';

@Provider()
export class HudStreetNameProvider {
    @Inject(HudWatchProvider)
    private readonly hudWatchProvider: HudWatchProvider;

    @Inject(HudStateProvider)
    private readonly hudStateProvider: HudStateProvider;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    private streetName: string[] = [];

    @Tick(TickInterval.EVERY_SECOND)
    public updateStreetNameLoop(): void {
        const position = GetEntityCoords(PlayerPedId(), true);
        const [streetA, streetB] = GetStreetNameAtCoord(position[0], position[1], position[2]);

        this.streetName = [`${GetStreetNameFromHashKey(streetA)}`];

        if (streetA !== streetB && streetB) {
            this.streetName.push(`${GetStreetNameFromHashKey(streetB)}`);
        }

        if (!this.hudStateProvider.isComputedHudVisible) {
            return;
        }

        if (!this.hudWatchProvider.haveWatch) {
            return;
        }

        this.nuiDispatch.dispatch('hud', 'UpdateStreetName', this.streetName);
    }
}
