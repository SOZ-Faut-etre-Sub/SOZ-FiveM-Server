import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { ClientEvent } from '../../shared/event';
import { Vector3 } from '../../shared/polyzone/vector';
import { DrawService } from '../draw.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { HudStateProvider } from './hud.state.provider';

const degreesToCardinal = (degrees: number): string => {
    const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45);
    return cardinals[index % 8];
};

const CompassConfig = {
    position: [0.5, 0.07],
    width: 0.25,
    fov: 180, // How many degrees the compass should cover
    ticksBetweenCardinals: 9.0, // How many ticks to display between each cardinal
};

@Provider()
export class HudCompassProvider {
    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    @Inject(HudStateProvider)
    private readonly hudStateProvider: HudStateProvider;

    @Inject(DrawService)
    private readonly drawService: DrawService;

    private _haveCompass = false;

    public get haveCompass(): boolean {
        return this._haveCompass;
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    async onPlayerUpdate(): Promise<void> {
        this._haveCompass = this.inventoryManager.hasEnoughItem('compass', 1, true);
    }

    @Tick()
    public showCompassLoop(): void {
        if (!this.hudStateProvider.isComputedHudVisible) {
            return;
        }

        if (!this.haveCompass) {
            return;
        }

        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (!vehicle) {
            return;
        }

        const degreePixelSize = CompassConfig.width / CompassConfig.fov;
        const rotation = GetGameplayCamRot(0) as Vector3;
        const heading = 360 - ((Math.round(rotation[2]) + 360) % 360);
        const x = CompassConfig.position[0] - CompassConfig.width / 2;
        let currentDegree = heading - CompassConfig.fov / 2;

        // we calibrate the start to be on the interval of ticksBetweenCardinals
        const degreeOffset =
            CompassConfig.ticksBetweenCardinals - (currentDegree % CompassConfig.ticksBetweenCardinals);
        currentDegree += degreeOffset;

        let positionX = x + degreeOffset * degreePixelSize;
        const endX = x + CompassConfig.width;

        while (positionX < endX) {
            if (currentDegree % 45 === 0) {
                const isPrimary = currentDegree % 90 === 0;

                DrawRect(positionX, CompassConfig.position[1], 0.001, isPrimary ? 0.012 : 0.006, 255, 255, 255, 255);

                this.drawService.drawText(
                    degreesToCardinal(currentDegree),
                    [positionX, CompassConfig.position[1] + 0.015],
                    {
                        size: isPrimary ? 0.25 : 0.2,
                        outline: true,
                        centered: true,
                    }
                );
            } else {
                DrawRect(positionX, CompassConfig.position[1], 0.001, 0.003, 255, 255, 255, 255);
            }

            currentDegree += CompassConfig.ticksBetweenCardinals;
            positionX += CompassConfig.ticksBetweenCardinals * degreePixelSize;
        }
    }
}
