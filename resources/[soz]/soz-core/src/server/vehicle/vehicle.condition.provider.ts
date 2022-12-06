import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Monitor } from '../../shared/monitor';
import { toVector3Object, Vector3 } from '../../shared/polyzone/vector';
import { ProgressAnimation, ProgressOptions } from '../../shared/progress';
import { PlayerVehicleState } from '../../shared/vehicle/player.vehicle';
import { PrismaService } from '../database/prisma.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { ProgressService } from '../player/progress.service';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleConditionProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Monitor)
    private monitor: Monitor;

    @Tick(TickInterval.EVERY_SECOND)
    public updateVehiclesCondition() {
        // Basically we keep tracks of all vehicles spawned and ask the current owner to update the condition of the vehicle
        const netIds = this.vehicleStateService.getSpawned();

        for (const netId of netIds) {
            const entityId = NetworkGetEntityFromNetworkId(netId);

            if (!entityId || !DoesEntityExist(entityId)) {
                const lastState = this.vehicleStateService.getLastSpawnData(netId);

                this.vehicleStateService.unregisterSpawned(netId);
                this.vehicleStateService.setLastSpawnData(netId, null);

                this.monitor.publish(
                    'vehicle_despawn',
                    {
                        vehicle_id: lastState?.id || null,
                        vehicle_net_id: netId,
                        vehicle_plate: lastState?.plate || null,
                    },
                    {
                        owner: lastState?.owner || null,
                        condition: lastState?.condition || null,
                        position: toVector3Object(lastState?.lastPosition || [0, 0, 0]),
                    }
                );

                continue;
            }

            const owner = NetworkGetEntityOwner(entityId);

            if (!owner) {
                continue;
            }

            const state = this.vehicleStateService.getVehicleState(entityId);
            this.vehicleStateService.setLastSpawnData(netId, state);

            TriggerClientEvent(ClientEvent.VEHICLE_CHECK_CONDITION, owner, netId);
        }
    }

    @OnEvent(ServerEvent.VEHICLE_USE_REPAIR_KIT)
    public async onVehicleUseRepairKit(source: number, vehicleNetworkId: number) {
        if (!this.inventoryManager.removeItemFromInventory(source, 'repairkit', 1)) {
            this.notifier.notify(source, "Vous n'avez pas de kit de réparation.");

            return;
        }

        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        const damageDiff = 2000 - state.condition.engineHealth - state.condition.tankHealth;
        const repairTime = (damageDiff * 20000) / 2000 + 10000; // Between 10s and 30s

        if (!(await this.doRepairVehicle(source, repairTime))) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicleEntity);

        this.notifier.notify(source, 'Votre véhicule a été réparé.');

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            engineHealth: 1000,
            tankHealth: 1000,
            doorStatus: {},
            windowStatus: {},
        });
    }

    @OnEvent(ServerEvent.VEHICLE_USE_CLEANING_KIT)
    public async onVehicleUseCleaningKit(source: number, vehicleNetworkId: number) {
        if (!this.inventoryManager.removeItemFromInventory(source, 'cleaningkit', 1)) {
            this.notifier.notify(source, "Vous n'avez pas de kit de nettoyage.");

            return;
        }

        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
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

        this.notifier.notify(source, 'Votre véhicule a été lavé.');

        const owner = NetworkGetEntityOwner(vehicleEntity);
        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            dirtLevel: 0,
        });
    }

    @OnEvent(ServerEvent.VEHICLE_USE_WHEEL_KIT)
    public async onVehicleUseWheelKit(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);
        const tireTemporaryRepairDistance = {};
        let repairTime = 10000;

        for (const wheelIndexStr of Object.keys(state.condition.tireHealth)) {
            const wheelIndex = parseInt(wheelIndexStr);
            const isBurst =
                state.condition.tireBurstCompletely[wheelIndex] || state.condition.tireBurstState[wheelIndex];

            if (isBurst) {
                repairTime += 10000;
            }

            tireTemporaryRepairDistance[wheelIndex] = 0;
        }

        if (repairTime === 0) {
            this.notifier.notify(source, 'Aucune roue à réparer.');

            return;
        }

        if (!this.inventoryManager.removeItemFromInventory(source, 'wheel_kit', 1)) {
            this.notifier.notify(source, "Vous n'avez pas de kit anti crevaison.");

            return;
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

        this.notifier.notify(
            source,
            'Vos roues sont temporairement réparées, rendez vous rapidement chez un garagiste pour les changer.'
        );

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            tireTemporaryRepairDistance,
            tireHealth: {},
            tireBurstCompletely: {},
            tireBurstState: {},
        });
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

    @OnEvent(ServerEvent.VEHICLE_SET_DEAD)
    public async onVehicleDead(source: number, vehicleNetworkId: number, reason: string) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(vehicleEntity);

        if (state.dead || !state.isPlayerVehicle) {
            return;
        }

        this.vehicleStateService.updateVehicleState(vehicleEntity, {
            dead: true,
        });

        if (!state.id) {
            return;
        }

        const vehicle = await this.prismaService.playerVehicle.update({
            where: {
                id: state.id,
            },
            data: {
                state: PlayerVehicleState.Destroyed,
            },
        });

        this.monitor.publish(
            'vehicle_destroy',
            {
                player_source: source,
                vehicle_plate: vehicle.plate,
            },
            {
                reason,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
    }

    @OnEvent(ServerEvent.VEHICLE_WASH)
    public async onVehicleWash(source: number, vehicleId: number) {
        if (this.playerMoneyService.remove(source, 50)) {
            const { completed } = await this.progressService.progress(
                source,
                'cleaning_vehicle',
                'Lavage du véhicule...',
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
            if (completed) {
                const entityId = NetworkGetEntityFromNetworkId(vehicleId);
                const owner = NetworkGetEntityOwner(entityId);
                TriggerClientEvent(ClientEvent.VEHICLE_UPDATE_DIRT_LEVEL, owner, vehicleId, 0);

                this.notifier.notify(source, 'Votre véhicule a été lavé.', 'success');
            } else {
                this.notifier.notify(source, 'Lavage échoué.', 'error');
            }
        } else {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');
        }
    }

    @OnEvent(ServerEvent.VEHICLE_ROUTE_EJECTION)
    public onVehicleRouteEjection(
        source: number,
        vehicleId: number,
        strength: number,
        velocity: Vector3,
        players: number[]
    ) {
        for (const player of players) {
            TriggerClientEvent(ClientEvent.VEHICLE_ROUTE_EJECTION, player, vehicleId, strength, velocity);
        }
    }
}
