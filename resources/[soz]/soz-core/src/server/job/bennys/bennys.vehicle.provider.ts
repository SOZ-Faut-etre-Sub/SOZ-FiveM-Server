import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { Monitor } from '../../../shared/monitor';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { ProgressAnimation, ProgressOptions } from '../../../shared/progress';
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

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_ENGINE)
    public async onRepairVehicleEngine(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        const damageDiff = 1000 - state.condition.engineHealth;
        const repairTime = (damageDiff * 30000) / 1000 + 10000; // Between 10s and 40s

        if (!(await this.doRepairVehicle(source, repairTime))) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicleEntity);

        this.notifier.notify(source, `Le moteur a été réparé.`);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            engineHealth: 1000,
        });

        this.monitor.publish(
            'job_bennys_repair_vehicle',
            {
                player_source: source,
                repair_type: 'engine',
            },
            {
                vehicle_plate: state.plate,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
    }

    @OnEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_BODY)
    public async onRepairVehicleEngineBody(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        const damageDiff = 1000 - state.condition.bodyHealth;
        const repairTime = (damageDiff * 30000) / 1000 + 10000; // Between 10s and 40s

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

        this.monitor.publish(
            'job_bennys_repair_vehicle',
            {
                player_source: source,
                repair_type: 'body',
            },
            {
                vehicle_plate: state.plate,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
    }

    @OnEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_TANK)
    public async onRepairVehicleEngineTank(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        const damageDiff = 1000 - state.condition.tankHealth;
        const repairTime = (damageDiff * 30000) / 1000 + 10000; // Between 10s and 40s

        if (!(await this.doRepairVehicle(source, repairTime))) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicleEntity);

        this.notifier.notify(source, `Le réservoir d'essence a été réparé.`);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            tankHealth: 1000,
        });

        this.monitor.publish(
            'job_bennys_repair_vehicle',
            {
                player_source: source,
                repair_type: 'tank',
            },
            {
                vehicle_plate: state.plate,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
    }

    @OnEvent(ServerEvent.BENNYS_REPAIR_VEHICLE_WHEEL)
    public async onRepairVehicleEngineWheel(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        let repairTime = 10000;

        for (const wheelIndexStr of Object.keys(state.condition.tireHealth)) {
            const wheelIndex = parseInt(wheelIndexStr);

            if (
                state.condition.tireBurstCompletely[wheelIndex] ||
                state.condition.tireBurstState[wheelIndex] ||
                state.condition.tireHealth[wheelIndex] <= 950
            ) {
                repairTime += 10000;
            }
        }

        if (
            !(await this.doRepairVehicle(
                source,
                repairTime,
                {
                    dictionary: 'amb@world_human_vehicle_mechanic@male@base',
                    name: 'base',
                    options: {
                        repeat: true,
                    },
                },
                {
                    headingEntity: {
                        entity: vehicleNetworkId,
                        heading: 180,
                    },
                }
            ))
        ) {
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

        this.monitor.publish(
            'job_bennys_repair_vehicle',
            {
                player_source: source,
                repair_type: 'wheel',
            },
            {
                vehicle_plate: state.plate,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
    }

    private async doRepairVehicle(
        source: number,
        repairTime: number,
        animation: ProgressAnimation = null,
        options: Partial<ProgressOptions> = null
    ) {
        if (!animation) {
            animation = {
                name: 'car_bomb_mechanic',
                dictionary: 'mp_car_bomb',
                options: {
                    onlyUpperBody: true,
                    repeat: true,
                },
            };
        }

        const { completed } = await this.progressService.progress(
            source,
            'repairing_vehicle',
            'Réparation du véhicule...',
            repairTime,
            animation,
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
                ...options,
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
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        const { completed } = await this.progressService.progress(
            source,
            'cleaning_vehicle',
            'Nettoyage du véhicule...',
            5000,
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

        this.monitor.publish(
            'job_bennys_clean_vehicle',
            {
                player_source: source,
            },
            {
                vehicle_plate: state.plate,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
    }
}
