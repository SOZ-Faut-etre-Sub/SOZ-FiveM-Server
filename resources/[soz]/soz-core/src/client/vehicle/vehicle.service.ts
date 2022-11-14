import { Inject, Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { RpcEvent } from '../../shared/rpc';
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

    public async getVehicleConfiguration(vehicleEntityId: number): Promise<VehicleConfiguration> {
        const state = this.getVehicleState(vehicleEntityId);
        let vehicleConfiguration = this.vehicleModificationService.getVehicleConfiguration(vehicleEntityId);

        if (state.id) {
            const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);
            vehicleConfiguration = await emitRpc<VehicleConfiguration>(
                RpcEvent.VEHICLE_CUSTOM_GET_MODS,
                vehicleNetworkId
            );
        }

        return vehicleConfiguration;
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
        console.log('applyVehicleCondition', vehicle, condition);
        SetVehicleFuelLevel(vehicle, condition.fuelLevel);

        const maxOilVolume = GetVehicleHandlingFloat(vehicle, 'CHandlingData', 'fOilVolume');

        if (maxOilVolume) {
            const realOilLevel = (condition.oilLevel * maxOilVolume) / 100;
            SetVehicleOilLevel(vehicle, realOilLevel);
        }

        SetVehicleDirtLevel(vehicle, condition.dirtLevel);

        if (condition.dirtLevel < 0.1) {
            WashDecalsFromVehicle(vehicle, 1.0);
        }

        SetVehicleBodyHealth(vehicle, condition.bodyHealth);

        if (condition.bodyHealth > 999.99) {
            SetVehicleFixed(vehicle);
            SetVehicleDeformationFixed(vehicle);
        }

        SetVehicleEngineHealth(vehicle, condition.engineHealth);
        SetVehiclePetrolTankHealth(vehicle, condition.tankHealth);

        const wheelNumber = 6;

        for (let i = 0; i < wheelNumber; i++) {
            SetVehicleWheelHealth(vehicle, i, condition.tireHealth[i] || 1000.0);
        }

        for (let i = 0; i < wheelNumber; i++) {
            if (condition.tireBurstCompletely[i]) {
                SetVehicleTyreBurst(vehicle, i, true, 1000.0);
            } else if (condition.tireBurstState[i]) {
                SetVehicleTyreBurst(vehicle, i, false, condition.tireHealth[i] || 1000.0);
            } else {
                SetVehicleTyreFixed(vehicle, i);
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
        const wheelNumber = 6;

        for (let i = 0; i < wheelNumber; i++) {
            tireHealth[i] = GetVehicleWheelHealth(vehicle, i);
        }

        for (let i = 0; i < wheelNumber; i++) {
            tireBurstState[i] = IsVehicleTyreBurst(vehicle, i, false);
        }

        for (let i = 0; i < wheelNumber; i++) {
            tireBurstCompletely[i] = IsVehicleTyreBurst(vehicle, i, true);
        }

        for (let i = 0; i < 8; i++) {
            windowStatus[i] = !IsVehicleWindowIntact(vehicle, i);
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
        this.vehicleModificationService.applyVehicleConfiguration(vehicle, modification);
    }
}
