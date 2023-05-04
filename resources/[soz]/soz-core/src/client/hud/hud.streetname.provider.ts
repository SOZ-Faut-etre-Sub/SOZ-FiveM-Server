import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { DrawService } from '../draw.service';
import { HudCompassProvider } from './hud.compass.provider';
import { HudStateProvider } from './hud.state.provider';

@Provider()
export class HudStreetNameProvider {
    @Inject(HudCompassProvider)
    private readonly hudCompassProvider: HudCompassProvider;

    @Inject(HudStateProvider)
    private readonly hudStateProvider: HudStateProvider;

    @Inject(DrawService)
    private readonly drawService: DrawService;

    private streetName = '';

    @Tick(TickInterval.EVERY_SECOND)
    public updateStreetNameLoop(): void {
        const position = GetEntityCoords(PlayerPedId(), true);
        const [streetA, streetB] = GetStreetNameAtCoord(position[0], position[1], position[2]);

        this.streetName = `${GetStreetNameFromHashKey(streetA)}`;

        if (streetA !== streetB && streetB) {
            this.streetName += ` & ${GetStreetNameFromHashKey(streetB)}`;
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    public showStreetNameLoop(): void {
        if (!this.hudStateProvider.isComputedHudVisible) {
            return;
        }

        if (!this.hudCompassProvider.haveCompass) {
            return;
        }

        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (!vehicle) {
            return;
        }

        this.drawService.drawText(this.streetName, [0.5, 0.02], {
            size: 0.45,
            outline: true,
            centered: true,
        });
    }
}
