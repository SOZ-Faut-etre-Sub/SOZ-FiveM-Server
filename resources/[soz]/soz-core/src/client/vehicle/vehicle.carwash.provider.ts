import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { MultiZone } from '../../shared/polyzone/multi.zone';
import { Vector3 } from '../../shared/polyzone/vector';
import { BlipFactory } from '../blip';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';
import { VehicleService } from './vehicle.service';

@Provider()
export class VehicleCarWashProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    private carWashZone: MultiZone = new MultiZone([
        new BoxZone([-699.68, -933.16, 19.01], 12, 6, {
            heading: 0,
            minZ: 18.01,
            maxZ: 22.01,
        }),
        new BoxZone([24.63, -1391.91, 29.35], 12, 7, {
            heading: 270,
            minZ: 28.35,
            maxZ: 32.35,
        }),
        new BoxZone([175.31, -1736.71, 29.29], 10, 10, {
            heading: 0,
            minZ: 28.29,
            maxZ: 32.29,
        }),
        new BoxZone([-75.24, 6429.37, 31.5], 12, 12, {
            heading: 45,
            minZ: 30.5,
            maxZ: 34.5,
        }),
        new BoxZone([1361.11, 3594.16, 34.89], 10, 14, {
            heading: 290,
            minZ: 33.89,
            maxZ: 37.89,
        }),
    ]);

    @Once(OnceStep.PlayerLoaded)
    onStart(): void {
        this.targetFactory.createForAllVehicle([
            {
                icon: 'c:mechanic/Car_wash.png',
                label: 'Laver sa voiture',
                action: entity => {
                    const networkId = NetworkGetNetworkIdFromEntity(entity);

                    TriggerServerEvent(ServerEvent.VEHICLE_WASH, networkId);
                },
                canInteract: () => {
                    const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

                    return this.carWashZone.isPointInside(position);
                },
                blackoutGlobal: true,
            },
        ]);

        for (const index in this.carWashZone.zones) {
            const zone = this.carWashZone.zones[index] as BoxZone;

            this.blipFactory.create(`carwash_${index}`, {
                sprite: 100,
                color: 37,
                name: 'Lavage Auto',
                coords: { x: zone.center[0], y: zone.center[1], z: zone.center[2] },
                alpha: 100,
                scale: 0.8,
            });
        }
    }

    @OnEvent(ClientEvent.VEHICLE_UPDATE_DIRT_LEVEL)
    onVehicleUpdateDirtLevel(vehicleId: number, dirtLevel: number) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const vehicleEntityId = NetworkGetEntityFromNetworkId(vehicleId);

        if (!vehicleEntityId) {
            return;
        }

        const state = this.vehicleService.getVehicleState(vehicleEntityId);

        SetVehicleDirtLevel(vehicleEntityId, dirtLevel);

        if (dirtLevel === 0) {
            WashDecalsFromVehicle(vehicleEntityId, 1.0);
        }

        this.vehicleService.updateVehicleState(vehicleEntityId, {
            condition: {
                ...state.condition,
                dirtLevel,
            },
        });
    }
}
