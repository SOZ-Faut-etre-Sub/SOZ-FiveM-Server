import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { MultiZone } from '../../shared/polyzone/multi.zone';
import { Vector3 } from '../../shared/polyzone/vector';
import { BlipFactory } from '../blip';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class VehicleCustomProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    private lsCustomZone = new MultiZone([
        new BoxZone([-339.46, -136.73, 39.01], 10, 10, {
            heading: 70,
            minZ: 38.01,
            maxZ: 42.01,
        }),
        new BoxZone([-1154.88, -2005.4, 13.18], 10, 10, {
            heading: 45,
            minZ: 12.18,
            maxZ: 16.18,
        }),
        new BoxZone([731.87, -1087.88, 22.17], 10, 10, {
            heading: 0,
            minZ: 21.17,
            maxZ: 25.17,
        }),
        new BoxZone([110.98, 6627.06, 31.89], 10, 10, {
            heading: 45,
            minZ: 30.89,
            maxZ: 34.89,
        }),
        new BoxZone([1175.88, 2640.3, 37.79], 10, 10, {
            heading: 45,
            minZ: 36.79,
            maxZ: 40.79,
        }),
    ]);

    @Once(OnceStep.PlayerLoaded)
    onStart(): void {
        for (const zoneIndex in this.lsCustomZone.zones) {
            const zone = this.lsCustomZone.zones[zoneIndex];

            this.blipFactory.create(`ls_custom_${zoneIndex}`, {
                sprite: 72,
                color: 46,
                coords: {
                    x: zone.center[0],
                    y: zone.center[1],
                    z: zone.center[2],
                },
                name: 'LS Custom',
            });
        }

        this.targetFactory.createForAllVehicle([
            {
                icon: 'c:mechanic/Ameliorer.png',
                label: 'Améliorer sa voiture',
                blackoutGlobal: true,
                canInteract: () => {
                    const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

                    return this.lsCustomZone.isPointInside(position);
                },
            },
        ]);
    }
}
