import { Inject, Injectable } from '@core/decorators/injectable';
import { Logger } from '@core/logger';
import { emitRpc } from '@core/rpc';
import { wait } from '@core/utils';
import { ServerEvent } from '@public/shared/event';

import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { VehicleConfiguration } from '../../shared/vehicle/modification';
import { VehicleCondition, VehicleEntityState } from '../../shared/vehicle/vehicle';
import { PlayerService } from '../player/player.service';
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

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Logger)
    private logger: Logger;

    public async getVehicleOwnership(vehicle: number, vehicleNetworkId: number, context: string): Promise<void> {
        let tryCount = 0;

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
        }
    }

    public async getVehicleConfiguration(vehicleEntityId: number): Promise<VehicleConfiguration> {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);

        return await emitRpc<VehicleConfiguration>(RpcServerEvent.VEHICLE_CUSTOM_GET_MODS, vehicleNetworkId);
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
    }

    public getVehicleCondition(vehicle: number): Partial<VehicleCondition> {
        const tireHealth = {};
        const tireBurstState = {};
        const tireBurstCompletely = {};
        const windowStatus = {};
        const doorStatus = {};
        const wheelNumber = 6;

        for (let i = 0; i < wheelNumber; i++) {
            tireHealth[i] = GetTyreHealth(vehicle, i);
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
            dirtLevel: GetVehicleDirtLevel(vehicle),
        };
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
