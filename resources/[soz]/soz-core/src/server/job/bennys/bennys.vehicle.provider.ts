import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';
import { VehicleService } from '../../vehicle/vehicle.service';
import { VehicleStateService } from '../../vehicle/vehicle.state.service';

@Provider()
export class BennysVehicleProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.BENNYS_REPAIR_VEHICLE)
    public async onRepairVehicle(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        const repairTime = (2000 - state.condition.engineHealth - state.condition.bodyHealth) * 30;

        const { completed } = await this.progressService.progress(
            source,
            'repairing_vehicle',
            'Réparation du véhicule...',
            repairTime,
            {
                name: 'car_bomb_mechanic',
                dictionary: 'mp_car_bomb',
                options: {
                    onlyUpperBody: true,
                    repeat: true,
                },
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
            }
        );

        if (!completed) {
            this.notifier.notify(source, 'Vous avez interrompu la réparation du véhicule.');

            return;
        }

        const owner = NetworkGetEntityOwner(vehicleEntity);
        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            engineHealth: 1000,
            bodyHealth: 1000,
            tankHealth: 1000,
            tireHealth: {},
            tireBurstCompletely: {},
            tireBurstState: {},
            doorStatus: {},
            windowStatus: {},
        });
    }

    @OnEvent(ServerEvent.BENNYS_WASH_VEHICLE)
    public async onWashVehicle(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const { completed } = await this.progressService.progress(
            source,
            'cleaning_vehicle',
            'Nettoyage du véhicule...',
            10000,
            {
                task: 'WORLD_HUMAN_MAID_CLEAN',
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
            }
        );

        if (!completed) {
            this.notifier.notify(source, 'Vous avez interrompu le lavage du véhicule.');

            return;
        }

        const owner = NetworkGetEntityOwner(vehicleEntity);
        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            dirtLevel: 0,
        });
    }
}
