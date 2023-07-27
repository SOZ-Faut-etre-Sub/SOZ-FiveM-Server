import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { VehicleCondition, VehicleVolatileState } from '../../shared/vehicle/vehicle';
import { NuiMenu } from '../nui/nui.menu';
import { TargetFactory } from '../target/target.factory';
import { VehicleFuelProvider } from './vehicle.fuel.provider';
import { VehicleService } from './vehicle.service';
import { VehicleStateService } from './vehicle.state.service';

type CurrentVehiclePosition = {
    vehicle: number;
    position: Vector3;
};

const TIRE_TEMPORARY_REPAIR_DISTANCE = 10000.0;

@Provider()
export class VehicleConditionProvider {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(VehicleFuelProvider)
    private vehicleFuelProvider: VehicleFuelProvider;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private currentVehiclePositionForMileage: CurrentVehiclePosition | null = null;

    private currentVehicleCondition: Map<number, VehicleCondition> = new Map();

    private currentVehiclePositionForTemporaryTire: CurrentVehiclePosition | null = null;

    @OnEvent(ClientEvent.VEHICLE_CONDITION_REGISTER)
    private registerVehicleCondition(vehicleNetworkId: number, condition: VehicleCondition): void {
        if (!NetworkDoesNetworkIdExist(vehicleNetworkId)) {
            return;
        }

        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        // cannot check a vehicle that does not exist
        if (!entityId) {
            return;
        }

        // cannot check a vehicle where we are not the owner
        if (!NetworkHasControlOfEntity(entityId)) {
            return;
        }

        this.currentVehicleCondition.set(vehicleNetworkId, condition);
    }

    @OnEvent(ClientEvent.VEHICLE_CONDITION_UNREGISTER)
    private unregisterVehicleCondition(vehicleNetworkId: number): void {
        this.currentVehicleCondition.delete(vehicleNetworkId);
    }

    public getVehicleCondition(vehicleNetworkId: number): VehicleCondition | null {
        return this.currentVehicleCondition.get(vehicleNetworkId) || null;
    }

    public setVehicleCondition(vehicleNetworkId: number, condition: Partial<VehicleCondition>) {
        const currentCondition = this.getVehicleCondition(vehicleNetworkId);

        if (null === currentCondition) {
            return;
        }

        this.currentVehicleCondition.set(vehicleNetworkId, {
            ...currentCondition,
            ...condition,
        });
    }

    @Tick(TickInterval.EVERY_SECOND)
    private async checkConditionLoop() {
        // loop through all vehicles we have to check
        for (const [vehicleNetworkId, currentCondition] of this.currentVehicleCondition) {
            if (!NetworkDoesNetworkIdExist(vehicleNetworkId)) {
                continue;
            }

            const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

            // cannot check a vehicle that does not exist
            if (!entityId) {
                continue;
            }

            // cannot check a vehicle where we are not the owner
            if (!NetworkHasControlOfEntity(entityId)) {
                continue;
            }

            // get the current condition of the vehicle
            const state = await this.vehicleStateService.getVehicleState(entityId);
            const fuelCondition = this.vehicleFuelProvider.checkVehicleFuel(entityId, currentCondition);

            const condition = {
                ...fuelCondition,
                ...this.vehicleService.getVehicleConditionDiff(entityId, currentCondition, state),
            };

            // if not empty
            if (Object.keys(condition).length > 0) {
                TriggerServerEvent(ServerEvent.VEHICLE_UPDATE_CONDITION_FROM_OWNER, vehicleNetworkId, condition);

                this.currentVehicleCondition.set(vehicleNetworkId, {
                    ...currentCondition,
                    ...condition,
                });
            }

            this.checkVehicleWater(entityId, state);
        }
    }

    private checkVehicleWater(vehicle: number, state: VehicleVolatileState) {
        if (!state.isPlayerVehicle || state.dead) {
            return;
        }

        const isDead = IsEntityDead(vehicle);

        if (isDead) {
            let reason = 'unknown';

            if (IsEntityInWater(vehicle)) {
                reason = 'water';
            } else if (IsEntityOnFire(vehicle)) {
                reason = 'fire';
            }

            SetVehicleEngineOn(vehicle, false, true, false);
            SetVehicleUndriveable(vehicle, true);

            const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

            TriggerServerEvent(ServerEvent.VEHICLE_SET_DEAD, vehicleNetworkId, reason);
        }
    }

    @OnEvent(ClientEvent.VEHICLE_CONDITION_APPLY)
    private async applyVehicleCondition(
        vehicleNetworkId: number,
        condition: Partial<VehicleCondition>,
        fullCondition: VehicleCondition
    ) {
        if (!NetworkDoesNetworkIdExist(vehicleNetworkId)) {
            return;
        }

        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        // cannot check a vehicle that does not exist
        if (!entityId) {
            return;
        }

        // cannot apply a vehicle where we are not the owner
        if (!NetworkHasControlOfEntity(entityId)) {
            return;
        }

        // resync state for owner if needed
        if (!this.currentVehicleCondition.has(vehicleNetworkId)) {
            this.currentVehicleCondition.set(vehicleNetworkId, fullCondition);
        }

        const newCondition = { ...this.currentVehicleCondition.get(vehicleNetworkId), ...condition };

        this.vehicleService.applyVehicleCondition(entityId, condition, newCondition);

        this.currentVehicleCondition.set(vehicleNetworkId, newCondition);
    }

    @OnEvent(ClientEvent.VEHICLE_CONDITION_SYNC)
    private async syncVehicleCondition(
        vehicleNetworkId: number,
        condition: Partial<VehicleCondition>,
        fullCondition: VehicleCondition
    ) {
        if (!NetworkDoesNetworkIdExist(vehicleNetworkId)) {
            return;
        }

        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        // cannot check a vehicle that does not exist
        if (!entityId) {
            return;
        }

        // if we are the owner, we do not need to sync
        if (NetworkHasControlOfEntity(entityId) || this.currentVehicleCondition.has(vehicleNetworkId)) {
            return;
        }

        this.vehicleService.applyVehicleCondition(entityId, condition, fullCondition);
    }

    @Tick(500)
    public checkVehicleMileage() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            this.currentVehiclePositionForMileage = null;

            return;
        }

        if (NetworkGetEntityIsLocal(vehicle) || !NetworkHasControlOfEntity(vehicle)) {
            this.currentVehiclePositionForMileage = null;

            return;
        }

        if (this.currentVehiclePositionForMileage && this.currentVehiclePositionForMileage.vehicle !== vehicle) {
            this.currentVehiclePositionForMileage = {
                vehicle,
                position: GetEntityCoords(vehicle, true) as Vector3,
            };

            return;
        }

        const lastVehiclePosition = this.currentVehiclePositionForMileage;
        this.currentVehiclePositionForMileage = {
            vehicle,
            position: GetEntityCoords(vehicle, true) as Vector3,
        };

        if (lastVehiclePosition === null) {
            return;
        }

        const diffDistance = getDistance(lastVehiclePosition.position, this.currentVehiclePositionForMileage.position);
        const networkId = NetworkGetNetworkIdFromEntity(vehicle);

        if (diffDistance < 0.1) {
            return;
        }

        TriggerServerEvent(ServerEvent.VEHICLE_UPDATE_MILEAGE, networkId, diffDistance);

        const [isTrailerExists, trailerEntity] = GetVehicleTrailerVehicle(vehicle);

        if (isTrailerExists) {
            const trailerNetworkId = NetworkGetNetworkIdFromEntity(trailerEntity);

            TriggerServerEvent(ServerEvent.VEHICLE_UPDATE_MILEAGE, trailerNetworkId, diffDistance);
        }
    }

    @Tick(500)
    public async checkVehicleTireRepair() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            this.currentVehiclePositionForTemporaryTire = null;

            return;
        }

        if (NetworkGetEntityIsLocal(vehicle) || !NetworkHasControlOfEntity(vehicle)) {
            this.currentVehiclePositionForTemporaryTire = null;

            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        if (!vehicleNetworkId) {
            this.currentVehiclePositionForTemporaryTire = null;

            return;
        }

        if (!this.currentVehicleCondition.get(vehicleNetworkId)) {
            this.currentVehiclePositionForTemporaryTire = null;

            return;
        }

        const currentCondition = this.currentVehicleCondition.get(vehicleNetworkId);
        const keys = Object.keys(currentCondition.tireTemporaryRepairDistance).map(key => parseInt(key, 10));

        if (keys.length === 0) {
            this.currentVehiclePositionForTemporaryTire = null;

            return;
        }

        if (
            this.currentVehiclePositionForTemporaryTire &&
            this.currentVehiclePositionForTemporaryTire.vehicle !== vehicle
        ) {
            this.currentVehiclePositionForTemporaryTire = {
                vehicle,
                position: GetEntityCoords(vehicle, true) as Vector3,
            };

            return;
        }

        const lastVehiclePosition = this.currentVehiclePositionForTemporaryTire;
        this.currentVehiclePositionForTemporaryTire = {
            vehicle,
            position: GetEntityCoords(vehicle, true) as Vector3,
        };

        if (lastVehiclePosition === null) {
            return;
        }

        const diffDistance = getDistance(
            lastVehiclePosition.position,
            this.currentVehiclePositionForTemporaryTire.position
        );

        const tireBurstCompletely = {};
        const tireTemporaryRepairDistance = { ...currentCondition.tireTemporaryRepairDistance };

        let applyCondition = false;

        for (const tireKey of keys) {
            const distance = tireTemporaryRepairDistance[tireKey] + diffDistance;

            if (distance < TIRE_TEMPORARY_REPAIR_DISTANCE) {
                tireTemporaryRepairDistance[tireKey] = distance;
            } else {
                delete tireTemporaryRepairDistance[tireKey];
                tireBurstCompletely[tireKey] = true;
                applyCondition = true;
            }
        }

        TriggerServerEvent(ServerEvent.VEHICLE_UPDATE_CONDITION_FROM_OWNER, vehicleNetworkId, {
            tireBurstCompletely,
        });

        if (applyCondition) {
            this.vehicleService.applyVehicleCondition(
                vehicle,
                {
                    tireBurstCompletely,
                },
                currentCondition
            );
        }
    }
}
