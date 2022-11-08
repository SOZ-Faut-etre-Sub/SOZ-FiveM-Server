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

    @OnEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_ENGINE)
    public async onRepairVehicleEngine(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        const repairTime = (1100 - state.condition.engineHealth) * 30;

        if (!(await this.doRepairVehicle(source, repairTime))) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicleEntity);

        this.notifier.notify(source, `Le moteur a été réparé.`);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            engineHealth: 1000,
        });
    }

    @OnEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_BODY)
    public async onRepairVehicleEngineBody(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        const repairTime = (1100 - state.condition.bodyHealth) * 30;

        if (!(await this.doRepairVehicle(source, repairTime))) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicleEntity);

        this.notifier.notify(source, `La carrosserie a été réparé.`);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            bodyHealth: 1000,
            doorStatus: {},
            windowStatus: {},
        });
    }

    @OnEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_TANK)
    public async onRepairVehicleEngineTank(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        const repairTime = (1100 - state.condition.tankHealth) * 30;

        if (!(await this.doRepairVehicle(source, repairTime))) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicleEntity);

        this.notifier.notify(source, `Le réservoir d'essence a été réparé.`);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            tankHealth: 1000,
        });
    }

    @OnEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_WHEEL)
    public async onRepairVehicleEngineWheel(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        let repairTime = 100;

        for (const wheelIndexStr of Object.keys(state.condition.tireHealth)) {
            const wheelIndex = parseInt(wheelIndexStr);
            const health = state.condition.tireBurstCompletely[wheelIndex] ? 0 : state.condition.tireHealth[wheelIndex];
            repairTime += 1000 - health;
        }

        console.log(state.condition);

        repairTime *= 30;

        if (!(await this.doRepairVehicle(source, repairTime))) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicleEntity);

        this.notifier.notify(source, `Les roues ont été réparées.`);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            tireTemporaryRepairDistance: {},
            tireHealth: {},
            tireBurstCompletely: {},
            tireBurstState: {},
        });
    }

    private async doRepairVehicle(source: number, repairTime: number) {
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

            return false;
        }

        return true;
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

        this.notifier.notify(source, `Le véhicule est bien lavé.`);

        const owner = NetworkGetEntityOwner(vehicleEntity);
        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            dirtLevel: 0,
        });
    }
}
