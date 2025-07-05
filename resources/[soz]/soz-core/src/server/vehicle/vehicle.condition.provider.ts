import { VehicleBusinessProvider } from '@private/server/gang/business.vehicle.provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { TaxType } from '@public/shared/tax';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { toVector3Object, Vector3 } from '../../shared/polyzone/vector';
import { ProgressAnimation, ProgressOptions } from '../../shared/progress';
import { PlayerVehicleState } from '../../shared/vehicle/player.vehicle';
import { PrismaService } from '../database/prisma.service';
import { Monitor } from '../monitor/monitor';
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

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(VehicleBusinessProvider)
    private vehicleBusinessProvider: VehicleBusinessProvider;

    private explodedVehicleToClean = new Map<
        number,
        {
            model: number;
            date: number;
            plate: string;
        }
    >();

    @OnEvent(ServerEvent.VEHICLE_USE_REPAIR_KIT)
    public async onVehicleUseRepairKit(source: number, vehicleNetworkId: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.remove('repairkit', 1, false)) {
            this.notifier.notify(source, "Vous n'avez pas de kit de réparation.");

            return;
        }

        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);
        const damageDiff = 2000 - state.condition.engineHealth - state.condition.tankHealth;
        const repairTime = (damageDiff * 20000) / 2000 + 10000; // Between 10s and 30s

        if (!(await this.doRepairVehicle(source, repairTime))) {
            return;
        }

        this.notifier.notify(source, 'Votre véhicule a été réparé mécaniquement.');

        this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, {
            engineHealth: 1000,
            tankHealth: 1000,
            doorStatus: {},
            windowStatus: {},
        });
    }

    @OnEvent(ServerEvent.VEHICLE_USE_BODY_REPAIR_KIT)
    public async onVehicleUseBodyRepairKit(source: number, vehicleNetworkId: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.remove('bodyrepairkit', 1, false)) {
            this.notifier.notify(source, "Vous n'avez pas de kit de réparation carosserie.");

            return;
        }

        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);
        const damageDiff = 1000 - state.condition.bodyHealth;
        const repairTime = (damageDiff * 20000) / 2000 + 10000; // Between 10s and 30s

        if (!(await this.doRepairVehicle(source, repairTime))) {
            return;
        }

        this.notifier.notify(source, 'La carosserie de votre véhicule a été réparée.');
        this.vehicleBusinessProvider.repairVehicule(vehicleNetworkId);

        this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, {
            bodyHealth: 1000,
            doorStatus: {},
            windowStatus: {},
            dirtLevel: 0,
        });
    }

    @OnEvent(ServerEvent.VEHICLE_USE_CLEANING_KIT)
    public async onVehicleUseCleaningKit(source: number, vehicleNetworkId: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.remove('cleaningkit', 1, false)) {
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

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.remove('wheel_kit', 1, false)) {
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

        if (state.volatile.dead) {
            return;
        }

        this.vehicleStateService.updateVehicleVolatileState(vehicleNetworkId, {
            dead: true,
        });

        if (state.volatile.isPlayerVehicle) {
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

            this.monitor.traceEvent('vehicle_destroy', {
                player_source: source,
                vehicle_plate: vehicle.plate,
                reason,
                position: toVector3Object(GetEntityCoords(NetworkGetEntityFromNetworkId(vehicleNetworkId)) as Vector3),
            });
        }

        const entity = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        this.explodedVehicleToClean.set(entity, {
            model: GetEntityModel(entity),
            date: Date.now() + 3_600_000,
            plate: GetVehicleNumberPlateText(entity),
        });
    }

    @Tick(TickInterval.EVERY_MINUTE)
    public cleanExplodedVeh() {
        for (const [entity, data] of this.explodedVehicleToClean.entries()) {
            if (!entity || !DoesEntityExist(entity)) {
                this.explodedVehicleToClean.delete(entity);
                continue;
            }

            if (GetEntityModel(entity) !== data.model) {
                this.explodedVehicleToClean.delete(entity);
                continue;
            }

            if (GetVehicleNumberPlateText(entity) !== data.plate) {
                this.explodedVehicleToClean.delete(entity);
                continue;
            }

            if (data.date < Date.now()) {
                DeleteEntity(entity);
                this.explodedVehicleToClean.delete(entity);
                continue;
            }
        }
    }

    @OnEvent(ServerEvent.VEHICLE_WASH)
    public async onVehicleWash(source: number, vehicleId: number) {
        if (!(await this.playerMoneyService.buy(source, 45, TaxType.VEHICLE))) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');

            return;
        }

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
    }

    @OnEvent(ServerEvent.VEHICLE_ROUTE_EJECTION)
    public onVehicleRouteEjection(
        source: number,
        vehicleId: number,
        strength: number,
        velocity: Vector3,
        players: number[],
        damaged: boolean
    ) {
        for (const player of players) {
            TriggerClientEvent(ClientEvent.VEHICLE_ROUTE_EJECTION, player, vehicleId, strength, velocity, damaged);
        }
    }

    @OnEvent(ServerEvent.VEHICLE_DAMAGE_BLUR)
    public onVehicleRouteBlur(source: number, players: number[], duration: number) {
        for (const player of players) {
            TriggerClientEvent(ClientEvent.VEHICLE_DAMAGE_BLUR, player, duration);
        }
    }

    @OnEvent(ServerEvent.VEHICLE_UPDATE_MILEAGE)
    public updateMileage(source: number, vehicleNetworkId: number, mileage: number) {
        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);

        this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, {
            mileage: state.condition.mileage + mileage,
        });
    }

    @OnEvent(ServerEvent.VEHICLE_BREAK_DOOR)
    public brokeDoor(source: number, vehicleNetworkId: number, door: number) {
        const entity = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        SetVehicleDoorBroken(entity, door, true);
    }
}
