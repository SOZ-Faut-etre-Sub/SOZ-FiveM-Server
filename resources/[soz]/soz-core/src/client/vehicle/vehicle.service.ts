import { Inject, Injectable } from '../../core/decorators/injectable';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { VehicleConfiguration } from '../../shared/vehicle/modification';
import { getDefaultVehicleState, VehicleCondition, VehicleEntityState } from '../../shared/vehicle/vehicle';
import { Qbcore } from '../qbcore';
import { VehicleModificationService } from './vehicle.modification.service';

type ClosestVehicleConfig = {
    maxDistance?: number;
    position?: Vector3 | Vector4 | null;
};

@Injectable()
export class VehicleService {
    @Inject(Qbcore)
    private QBCore: Qbcore;

    @Inject(VehicleModificationService)
    private vehicleModificationService: VehicleModificationService;

    public getVehicleProperties(vehicle: number): any[] {
        return this.QBCore.getVehicleProperties(vehicle);
    }

    public getVehicleState(vehicle: number): VehicleEntityState {
        const state = Entity(vehicle).state;
        const defaultState = getDefaultVehicleState();
        const returnState = {};

        for (const key of Object.keys(defaultState)) {
            returnState[key] = state[key] || defaultState[key];
        }

        return returnState as VehicleEntityState;
    }

    public updateVehicleState(vehicle: number, state: Partial<VehicleEntityState>): void {
        for (const [key, value] of Object.entries(state)) {
            Entity(vehicle).state.set(key, value, true);
        }
    }

    public getClosestVehicle(config?: ClosestVehicleConfig, filter?: (vehicle: number) => boolean): number | null {
        const maxDistance = config?.maxDistance || 10.0;
        const currentPed = PlayerPedId();

        // Only check current ped vehicle if no position is provided
        if (!config?.position) {
            const vehicle = GetVehiclePedIsIn(currentPed, false);

            if (vehicle) {
                return vehicle;
            }
        }

        const vehicles = GetGamePool('CVehicle');
        const position = config?.position || (GetEntityCoords(currentPed, false) as Vector3);

        let closestVehicle = null;
        let closestDistance: number | null = null;

        for (const vehicle of vehicles) {
            const vehicleCoords = GetEntityCoords(vehicle, false) as Vector3;
            const distance = getDistance(position, vehicleCoords);

            if (closestDistance === null || distance < closestDistance) {
                if (filter && !filter(vehicle)) {
                    continue;
                }

                closestVehicle = vehicle;
                closestDistance = distance;
            }
        }

        if (!closestDistance || closestDistance > maxDistance) {
            return null;
        }

        return closestVehicle;
    }

    public syncVehicle(vehicle: number, state: VehicleEntityState): void {
        SetVehicleModKit(vehicle, 0);

        if (state.plate) {
            SetVehicleNumberPlateText(vehicle, state.plate);
        }

        this.applyVehicleCondition(vehicle, state.condition);
    }

    public applyVehicleCondition(vehicle: number, condition: VehicleCondition): void {
        SetVehicleFuelLevel(vehicle, condition.fuelLevel);
        SetVehicleOilLevel(vehicle, condition.oilLevel);
        SetVehicleDirtLevel(vehicle, condition.dirtLevel);
        SetVehicleBodyHealth(vehicle, condition.bodyHealth);
        SetVehicleEngineHealth(vehicle, condition.engineHealth);
        SetVehiclePetrolTankHealth(vehicle, condition.tankHealth);

        if (condition.dirtLevel < 0.1) {
            WashDecalsFromVehicle(vehicle, 1.0);
        }

        if (condition.bodyHealth > 999.99) {
            SetVehicleFixed(vehicle);
            SetVehicleDeformationFixed(vehicle);
        }

        for (const [key, value] of Object.entries(condition.tireHealth)) {
            SetVehicleWheelHealth(vehicle, parseInt(key, 10), value);
        }

        for (const [key, value] of Object.entries(condition.tireBurstState)) {
            if (value) {
                SetVehicleTyreBurst(vehicle, parseInt(key, 10), false, 1000);
            }
        }

        for (const [key, value] of Object.entries(condition.tireBurstCompletely)) {
            if (value) {
                SetVehicleTyreBurst(vehicle, parseInt(key, 10), true, 1000);
            }
        }

        for (const [key, value] of Object.entries(condition.doorStatus)) {
            if (value) {
                SetVehicleDoorBroken(vehicle, parseInt(key, 10), true);
            }
        }

        for (const [key, value] of Object.entries(condition.windowStatus)) {
            if (value) {
                SmashVehicleWindow(vehicle, parseInt(key, 10));
            }
        }
    }

    public getVehicleCondition(vehicle: number): Partial<VehicleCondition> {
        const tireHealth = {};
        const tireBurstState = {};
        const tireBurstCompletely = {};
        const windowStatus = {};
        const doorStatus = {};

        for (let i = 0; i < 6; i++) {
            tireHealth[i] = GetVehicleWheelHealth(vehicle, i);
        }

        for (let i = 0; i < 6; i++) {
            tireBurstState[i] = IsVehicleTyreBurst(vehicle, i, false);
        }

        for (let i = 0; i < 6; i++) {
            tireBurstCompletely[i] = IsVehicleTyreBurst(vehicle, i, true);
        }

        for (let i = 0; i < 8; i++) {
            windowStatus[i] = IsVehicleWindowIntact(vehicle, i);
        }

        for (let i = 0; i < 6; i++) {
            doorStatus[i] = IsVehicleDoorDamaged(vehicle, i);
        }

        return {
            bodyHealth: GetVehicleBodyHealth(vehicle),
            engineHealth: GetVehicleEngineHealth(vehicle),
            tankHealth: GetVehiclePetrolTankHealth(vehicle),
            tireHealth,
            tireBurstCompletely,
            tireBurstState,
            doorStatus,
            windowStatus,
        };
    }

    public applyVehicleConfiguration(vehicle: number, modification: VehicleConfiguration): void {
        this.vehicleModificationService.applyVehicleModification(vehicle, modification);
    }
}
