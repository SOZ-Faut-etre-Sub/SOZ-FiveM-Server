import { Inject, Injectable } from '@core/decorators/injectable';
import { Logger } from '@core/logger';
import { emitRpc } from '@core/rpc';
import { wait } from '@core/utils';
import { ServerEvent } from '@public/shared/event';

import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { VehicleConfiguration, VehicleModification } from '../../shared/vehicle/modification';
import { VehicleCondition, VehicleVolatileState } from '../../shared/vehicle/vehicle';
import { PlayerService } from '../player/player.service';
import { Qbcore } from '../qbcore';
import { VehicleModificationService } from './vehicle.modification.service';

type ClosestVehicleConfig = {
    maxDistance?: number;
    position?: Vector3 | Vector4 | null;
};

type VehicleConditionItemHelper<T extends keyof VehicleCondition, V extends VehicleCondition[T]> = {
    apply: (vehicle: number, value: V, condition: VehicleCondition) => void;
    get: (vehicle: number, state: VehicleVolatileState) => V;
    compare?: (a: V, b: V) => boolean;
};

type VehicleConditionHelper<T extends keyof VehicleCondition> = Record<
    T,
    VehicleConditionItemHelper<T, VehicleCondition[T]>
>;

const applyVehicleTire = (
    vehicle: number,
    tireHealth: { [key: number]: number },
    tireBurstCompletely: { [key: number]: boolean },
    tireBurstState: { [key: number]: boolean }
) => {
    const wheelNumber = 6;

    for (let i = 0; i < wheelNumber; i++) {
        SetVehicleWheelHealth(vehicle, i, tireHealth[i] || 1000.0);
    }

    for (let i = 0; i < wheelNumber; i++) {
        if (tireBurstCompletely[i]) {
            SetVehicleTyreBurst(vehicle, i, true, 1000.0);
        } else if (tireBurstState[i]) {
            SetVehicleTyreBurst(vehicle, i, false, tireHealth[i] || 1000.0);
        } else {
            SetVehicleTyreFixed(vehicle, i);
        }
    }
};

const VehicleConditionHelpers: Partial<VehicleConditionHelper<keyof VehicleCondition>> = {
    bodyHealth: {
        apply: (vehicle, value: number, condition) => {
            SetVehicleBodyHealth(vehicle, value);

            if (value > 999.99) {
                SetVehicleDeformationFixed(vehicle);
                SetVehicleFixed(vehicle);
            }

            SetVehicleEngineHealth(vehicle, condition.engineHealth);
            SetVehiclePetrolTankHealth(vehicle, condition.tankHealth);
        },
        get: vehicle => GetVehicleBodyHealth(vehicle),
    },
    engineHealth: {
        apply: (vehicle, value: number) => {
            SetVehicleEngineHealth(vehicle, value);
        },
        get: vehicle => GetVehicleEngineHealth(vehicle),
    },
    dirtLevel: {
        apply: (vehicle, value: number) => {
            SetVehicleDirtLevel(vehicle, value);

            if (value < 0.1) {
                WashDecalsFromVehicle(vehicle, 1.0);
            }
        },
        get: vehicle => GetVehicleDirtLevel(vehicle),
    },
    tankHealth: {
        apply: (vehicle, value: number) => {
            SetVehiclePetrolTankHealth(vehicle, value);
        },
        get: vehicle => GetVehiclePetrolTankHealth(vehicle),
    },
    tireHealth: {
        apply: (vehicle, value: { [key: number]: number }, condition) => {
            applyVehicleTire(vehicle, value, condition.tireBurstCompletely, condition.tireBurstState);
        },
        get: vehicle => {
            const wheelNumber = 6;
            const result: { [key: number]: number } = {};

            for (let i = 0; i < wheelNumber; i++) {
                result[i] = GetTyreHealth(vehicle, i);
            }

            return result;
        },
        compare: (newValue: { [key: number]: number }, previousValue: { [key: number]: number }): boolean => {
            for (const key in newValue) {
                if (!Object.prototype.hasOwnProperty.call(newValue, key)) {
                    return true;
                }

                if (newValue[key] !== previousValue[key]) {
                    return true;
                }
            }

            return false;
        },
    },
    tireBurstCompletely: {
        apply: (vehicle, value: { [key: number]: boolean }, condition) => {
            applyVehicleTire(vehicle, condition.tireHealth, value, condition.tireBurstState);
        },
        get: vehicle => {
            const wheelNumber = 6;
            const result: { [key: number]: boolean } = {};

            for (let i = 0; i < wheelNumber; i++) {
                result[i] = IsVehicleTyreBurst(vehicle, i, true);
            }

            return result;
        },
        compare: (newValue: { [key: number]: boolean }, previousValue: { [key: number]: boolean }): boolean => {
            for (const key in newValue) {
                if (!Object.prototype.hasOwnProperty.call(newValue, key)) {
                    return true;
                }

                if (newValue[key] !== previousValue[key]) {
                    return true;
                }
            }

            return false;
        },
    },
    tireBurstState: {
        apply: (vehicle, value: { [key: number]: boolean }, condition) => {
            applyVehicleTire(vehicle, condition.tireHealth, condition.tireBurstCompletely, value);
        },
        get: vehicle => {
            const wheelNumber = 6;
            const result: { [key: number]: boolean } = {};

            for (let i = 0; i < wheelNumber; i++) {
                result[i] = IsVehicleTyreBurst(vehicle, i, false);
            }

            return result;
        },
        compare: (newValue: { [key: number]: boolean }, previousValue: { [key: number]: boolean }): boolean => {
            for (const key in newValue) {
                if (!Object.prototype.hasOwnProperty.call(newValue, key)) {
                    return true;
                }

                if (newValue[key] !== previousValue[key]) {
                    return true;
                }
            }

            return false;
        },
    },
    windowStatus: {
        apply: (vehicle, value: { [key: number]: boolean }) => {
            const windowNumber = 8;

            for (let i = 0; i < windowNumber; i++) {
                if (value[i]) {
                    SmashVehicleWindow(vehicle, i);
                } else {
                    RollUpWindow(vehicle, i);
                }
            }
        },
        get: (vehicle, state) => {
            const windowNumber = 8;
            const result: { [key: number]: boolean } = {};

            for (let i = 0; i < windowNumber; i++) {
                if (state.openWindows && (i === 0 || i === 1)) {
                    continue;
                }

                result[i] = !IsVehicleWindowIntact(vehicle, i);
            }

            return result;
        },
        compare: (newValue: { [key: number]: boolean }, previousValue: { [key: number]: boolean }): boolean => {
            for (const key in newValue) {
                if (!Object.prototype.hasOwnProperty.call(newValue, key)) {
                    return true;
                }

                if (newValue[key] !== previousValue[key]) {
                    return true;
                }
            }

            return false;
        },
    },
    doorStatus: {
        apply: (vehicle, value: { [key: number]: boolean }) => {
            const doorNumber = 6;

            for (let i = 0; i < doorNumber; i++) {
                if (value[i]) {
                    SetVehicleDoorBroken(vehicle, i, true);
                }
            }
        },
        get: vehicle => {
            const doorNumber = 6;
            const result: { [key: number]: boolean } = {};

            for (let i = 0; i < doorNumber; i++) {
                result[i] = IsVehicleDoorDamaged(vehicle, i);
            }

            return result;
        },
        compare: (newValue: { [key: number]: boolean }, previousValue: { [key: number]: boolean }): boolean => {
            for (const key in newValue) {
                if (!Object.prototype.hasOwnProperty.call(newValue, key)) {
                    return true;
                }

                if (newValue[key] !== previousValue[key]) {
                    return true;
                }
            }

            return false;
        },
    },
};

@Injectable()
export class VehicleService {
    @Inject(Qbcore)
    private QBCore: Qbcore;

    @Inject(VehicleModificationService)
    private vehicleModificationService: VehicleModificationService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Logger)
    private logger: Logger;

    public async getVehicleOwnership(vehicle: number, vehicleNetworkId: number, context: string): Promise<boolean> {
        let tryCount = 0;

        if (NetworkHasControlOfEntity(vehicle) && NetworkHasControlOfNetworkId(vehicleNetworkId)) {
            return true;
        }

        while (
            !NetworkRequestControlOfEntity(vehicle) &&
            !NetworkRequestControlOfNetworkId(vehicleNetworkId) &&
            tryCount < 10
        ) {
            await wait(100);
            tryCount++;
        }

        if (!NetworkHasControlOfEntity(vehicle) || !NetworkHasControlOfNetworkId(vehicleNetworkId)) {
            this.logger.error(`failed to get ownership of vehicle ${vehicle} / ${vehicleNetworkId} [${context}]`);

            return false;
        }

        SetEntityAsMissionEntity(vehicle, true, false);
        SetVehicleHasBeenOwnedByPlayer(vehicle, true);

        return true;
    }

    public async getVehicleConfiguration(vehicleEntityId: number): Promise<VehicleConfiguration> {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);
        const configuration = await emitRpc<VehicleConfiguration>(
            RpcServerEvent.VEHICLE_CUSTOM_GET_MODS,
            vehicleNetworkId
        );

        if (!configuration) {
            return this.vehicleModificationService.getVehicleConfiguration(vehicleEntityId);
        }

        return configuration;
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

    public getVehicleConditionDiff(
        vehicle: number,
        previousCondition: Partial<VehicleCondition>,
        state: VehicleVolatileState
    ): Partial<VehicleCondition> {
        const condition: Partial<VehicleCondition> = {};

        for (const [key, helper] of Object.entries(VehicleConditionHelpers)) {
            const newValue = helper.get(vehicle, state);
            const hasChange = helper.compare
                ? helper.compare(newValue, previousCondition[key])
                : newValue !== previousCondition[key];

            if (hasChange) {
                condition[key] = newValue;
            }
        }

        return condition;
    }

    public applyVehicleCondition(
        vehicle: number,
        applyCondition: Partial<VehicleCondition>,
        condition: VehicleCondition
    ): void {
        for (const [key, value] of Object.entries(applyCondition)) {
            const helper = VehicleConditionHelpers[key] as VehicleConditionItemHelper<any, any>;

            if (!helper) {
                continue;
            }

            helper.apply(vehicle, value, condition);
        }
    }

    public applyVehicleConfigurationPerformance(vehicle: number, modification: VehicleConfiguration): void {
        const modificationPerformance = {} as VehicleModification;

        if (modification.modification.engine) {
            modificationPerformance.engine = modification.modification.engine;
        }

        if (modification.modification.brakes) {
            modificationPerformance.brakes = modification.modification.brakes;
        }

        if (modification.modification.transmission) {
            modificationPerformance.transmission = modification.modification.transmission;
        }

        if (modification.modification.suspension) {
            modificationPerformance.suspension = modification.modification.suspension;
        }

        if (modification.modification.armor) {
            modificationPerformance.armor = modification.modification.armor;
        }

        if (modification.modification.turbo) {
            modificationPerformance.turbo = modification.modification.turbo;
        }

        this.vehicleModificationService.applyVehicleModification(vehicle, modification, modificationPerformance, true);
    }

    public applyVehicleConfiguration(vehicle: number, modification: VehicleConfiguration): void {
        this.vehicleModificationService.applyVehicleConfiguration(vehicle, modification);
    }

    public updateVehiculeClothConfig() {
        this.playerService.reApplyHeadConfig();

        TriggerServerEvent(
            ServerEvent.PLAYER_UPDATE_HAT_VEHICLE,
            GetPedPropIndex(PlayerPedId(), 0),
            GetPedPropTextureIndex(PlayerPedId(), 0)
        );
    }

    public checkBackOfVehicle(vehicle: number): boolean {
        const playerPosition = GetEntityCoords(PlayerPedId(), true) as Vector3;
        const model = GetEntityModel(vehicle);
        const [min, max] = GetModelDimensions(model) as [Vector3, Vector3];
        const vehicleLength = max[1] - min[1];
        const backPosition = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, -vehicleLength / 2, 0.0) as Vector3;
        const distance = getDistance(backPosition, playerPosition);
        return distance < 2.0;
    }
}
