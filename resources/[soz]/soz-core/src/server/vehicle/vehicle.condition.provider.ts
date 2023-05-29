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

    @Tick(TickInterval.EVERY_SECOND, 'vehicle:condition:update')
    public async updateVehiclesCondition() {
        // Basically we keep tracks of all vehicles spawned and ask the current owner to update the condition of the vehicle
        const states = this.vehicleStateService.getStates().keys();

        for (const netId of states) {
            const state = this.vehicleStateService.getVehicleState(netId);
            const entityId = NetworkGetEntityFromNetworkId(netId);

            // entity has despawn
            if (!entityId || !DoesEntityExist(entityId)) {
                this.vehicleStateService.unregister(netId);

                if (!state.volatile.isPlayerVehicle || !state.volatile.id) {
                    continue;
                }

                await this.prismaService.playerVehicle.update({
                    where: {
                        id: state.volatile.id,
                    },
                    data: {
                        state: PlayerVehicleState.InSoftPound,
                        garage: 'pound',
                        parkingtime: Math.round(Date.now() / 1000),
                    },
                });

                this.monitor.publish(
                    'vehicle_despawn',
                    {
                        vehicle_id: state.volatile.id || null,
                        vehicle_net_id: netId,
                        vehicle_plate: state.volatile.plate || null,
                    },
                    {
                        owner: state.owner || null,
                        condition: state.condition || null,
                        position: toVector3Object(state.position || [0, 0, 0]),
                    }
                );

                continue;
            }

            // check if the vehicle is owned by the same player
            const owner = NetworkGetEntityOwner(entityId);

            if (owner !== state.owner) {
                this.vehicleStateService.switchOwner(netId, owner);
            }
        }
    }

    @OnEvent(ServerEvent.VEHICLE_USE_REPAIR_KIT)
    public async onVehicleUseRepairKit(source: number, vehicleNetworkId: number) {
        if (!this.inventoryManager.removeItemFromInventory(source, 'repairkit', 1)) {
            this.notifier.notify(source, "Vous n'avez pas de kit de réparation.");

            return;
        }

        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);
        const damageDiff = 2000 - state.condition.engineHealth - state.condition.tankHealth;
        const repairTime = (damageDiff * 20000) / 2000 + 10000; // Between 10s and 30s

        if (!(await this.doRepairVehicle(source, repairTime))) {
            return;
        }

        this.notifier.notify(source, 'Votre véhicule a été réparé.');

        this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, {
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

        this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, {
            dirtLevel: 0,
        });
    }

    @OnEvent(ServerEvent.VEHICLE_USE_WHEEL_KIT)
    public async onVehicleUseWheelKit(source: number, vehicleNetworkId: number) {
        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);
        const tireTemporaryRepairDistance = {};
        let repairTime = 10000;

        for (const wheelIndexStr of Object.keys(state.condition.tireHealth)) {
            const wheelIndex = parseInt(wheelIndexStr);
            const isBurst =
                state.condition.tireBurstCompletely[wheelIndex] || state.condition.tireBurstState[wheelIndex];

            if (isBurst) {
                repairTime += 10000;
                tireTemporaryRepairDistance[wheelIndex] = 0;
            }
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

        this.notifier.notify(
            source,
            'Vos roues sont temporairement réparées, rendez vous rapidement chez un garagiste pour les changer.'
        );

        this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, {
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
        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);

        if (state.volatile.dead || !state.volatile.isPlayerVehicle) {
            return;
        }

        this.vehicleStateService.updateVehicleVolatileState(vehicleNetworkId, {
            dead: true,
        });

        if (!state.volatile.id) {
            return;
        }

        const vehicle = await this.prismaService.playerVehicle.update({
            where: {
                id: state.volatile.id,
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
                this.vehicleStateService.updateVehicleCondition(vehicleId, {
                    dirtLevel: 0,
                });

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

    @OnEvent(ServerEvent.VEHICLE_UPDATE_MILEAGE)
    public updateMileage(source: number, vehicleNetworkId: number, mileage: number) {
        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);

        this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, {
            mileage: state.condition.mileage + mileage,
        });
    }
}
