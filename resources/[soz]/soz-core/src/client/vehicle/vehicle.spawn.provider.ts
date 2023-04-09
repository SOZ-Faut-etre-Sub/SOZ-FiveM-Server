import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Logger } from '../../core/logger';
import { wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { RpcClientEvent } from '../../shared/rpc';
import { VehicleClass, VehicleSpawn, VehicleType, VehicleTypeFromClass } from '../../shared/vehicle/vehicle';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../resources/resource.loader';
import { VehicleService } from './vehicle.service';

@Provider()
export class VehicleSpawnProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Logger)
    private logger: Logger;

    private lastVehicleSpawn: number | null = null;

    @OnEvent(ClientEvent.VEHICLE_GET_CLOSEST)
    getClosestVehicle(responseId: string) {
        const vehicle = this.vehicleService.getClosestVehicle();
        const vehicleNetworkId = vehicle ? NetworkGetNetworkIdFromEntity(vehicle) : 0;
        const isInside = vehicle && GetVehiclePedIsIn(PlayerPedId(), false) === vehicle;
        let distance = 0;

        if (vehicle) {
            const coords = GetEntityCoords(PlayerPedId()) as Vector3;
            const vehicleCoords = GetEntityCoords(vehicle) as Vector3;
            distance = getDistance(coords, vehicleCoords);
        }

        TriggerServerEvent(ServerEvent.VEHICLE_SET_CLOSEST, responseId, vehicleNetworkId, distance, isInside);
    }

    @Rpc(RpcClientEvent.VEHICLE_GET_TYPE)
    async getVehicleType(modelHash: number): Promise<VehicleType> {
        const vehicleClass = GetVehicleClassFromName(modelHash) as VehicleClass;

        if (modelHash === GetHashKey('submersible') || modelHash === GetHashKey('submersible2')) {
            return VehicleType.Submarine;
        }

        return VehicleTypeFromClass[vehicleClass];
    }

    @Rpc(RpcClientEvent.VEHICLE_SPAWN_FROM_SERVER)
    async spawnFromServerVehicle(networkId: number, vehicleSpawn: VehicleSpawn): Promise<boolean> {
        if (!NetworkDoesEntityExistWithNetworkId(networkId) || !NetworkDoesNetworkIdExist(networkId)) {
            this.logger.error(`network id ${networkId} does not exist, cannot spawn vehicle`);

            return false;
        }

        const vehicle = NetworkGetEntityFromNetworkId(networkId);

        if (!vehicle) {
            this.logger.error(
                `network id ${networkId} exist, but linked entity is not available, cannot spawn vehicle`
            );

            return false;
        }

        if (!vehicle || !DoesEntityExist(vehicle)) {
            this.logger.error(
                `network id ${networkId} exist, but linked entity is not available, cannot spawn vehicle`
            );
            return false;
        }

        if (!IsEntityAVehicle(vehicle)) {
            this.logger.error(
                `network id ${networkId} exist, but linked entity is not a vehicle, cannot spawn vehicle`
            );
            return false;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            this.logger.error(
                `network id ${networkId} exist, but current player is not the owner, cannot spawn vehicle`
            );
            return false;
        }

        this.doSpawn(vehicle, networkId, vehicleSpawn);

        return true;
    }

    @Rpc(RpcClientEvent.VEHICLE_SPAWN)
    async spawnFromClientVehicle(vehicleSpawn: VehicleSpawn): Promise<number | null> {
        const player = this.playerService.getPlayer();

        if (!player) {
            return null;
        }

        let hash = vehicleSpawn.hash;

        if (!IsModelInCdimage(hash) || !IsModelAVehicle(hash)) {
            hash = GetHashKey(vehicleSpawn.model);

            if (!IsModelInCdimage(hash) || !IsModelAVehicle(hash)) {
                console.error(
                    'could not load model with given hash or model name',
                    vehicleSpawn.model,
                    vehicleSpawn.hash
                );

                return null;
            }
        }

        await this.resourceLoader.loadModel(vehicleSpawn.model);

        const vehicle = CreateVehicle(
            vehicleSpawn.model,
            vehicleSpawn.position[0],
            vehicleSpawn.position[1],
            vehicleSpawn.position[2],
            vehicleSpawn.position[3],
            true,
            true
        );

        this.resourceLoader.unloadModel(vehicleSpawn.model);

        const networkId = NetworkGetNetworkIdFromEntity(vehicle);

        if (!NetworkDoesEntityExistWithNetworkId(networkId) || !NetworkDoesNetworkIdExist(networkId)) {
            this.logger.error(`network id ${networkId} does not exist, cannot spawn vehicle`);
            DeleteVehicle(vehicle);

            return null;
        }

        await this.doSpawn(vehicle, networkId, vehicleSpawn);
        this.lastVehicleSpawn = vehicle;

        return networkId;
    }

    @Rpc(RpcClientEvent.GET_LAST_VEHICLE_SPAWN)
    async getLastVehicleSpawn(vehicleSpawn: VehicleSpawn): Promise<number> {
        if (!this.lastVehicleSpawn) {
            return null;
        }

        if (!DoesEntityExist(this.lastVehicleSpawn)) {
            this.lastVehicleSpawn = null;

            return null;
        }

        const model = GetEntityModel(this.lastVehicleSpawn);

        if (model !== vehicleSpawn.hash) {
            this.lastVehicleSpawn = null;

            return null;
        }

        const networkId = NetworkGetNetworkIdFromEntity(this.lastVehicleSpawn);

        if (!NetworkDoesEntityExistWithNetworkId(networkId) || !NetworkDoesNetworkIdExist(networkId)) {
            this.logger.error(`network id ${networkId} does not exist, cannot get last vehicle spawn`);
            DeleteVehicle(this.lastVehicleSpawn);

            return null;
        }

        return networkId;
    }

    @Rpc(RpcClientEvent.DELETE_LAST_VEHICLE_SPAWN)
    async deleteLastVehicleSpawn(vehicleSpawn: VehicleSpawn): Promise<boolean> {
        if (this.lastVehicleSpawn) {
            return false;
        }

        if (!DoesEntityExist(this.lastVehicleSpawn)) {
            this.lastVehicleSpawn = null;

            return false;
        }

        if (!IsEntityAVehicle(this.lastVehicleSpawn)) {
            this.lastVehicleSpawn = null;

            return false;
        }

        const model = GetEntityModel(this.lastVehicleSpawn);

        if (model !== vehicleSpawn.hash) {
            this.lastVehicleSpawn = null;

            return false;
        }

        DeleteVehicle(this.lastVehicleSpawn);
        this.lastVehicleSpawn = null;

        return true;
    }

    private async doSpawn(vehicle: number, networkId: number, vehicleSpawn: VehicleSpawn) {
        SetNetworkIdCanMigrate(networkId, true);
        SetEntityAsMissionEntity(vehicle, true, false);
        SetVehicleHasBeenOwnedByPlayer(vehicle, true);
        SetVehicleNeedsToBeHotwired(vehicle, false);
        SetVehRadioStation(vehicle, 'OFF');

        while (IsEntityWaitingForWorldCollision(vehicle)) {
            await wait(0);
        }

        SetVehicleOnGroundProperly(vehicle);

        for (let i = -1; i < 1; i++) {
            const ped = GetPedInVehicleSeat(vehicle, i);

            if (!IsPedAPlayer(ped)) {
                DeleteEntity(ped);
            }
        }

        if (vehicleSpawn.warp) {
            const ped = PlayerPedId();

            TaskWarpPedIntoVehicle(ped, vehicle, -1);
        }

        if (vehicleSpawn.modification) {
            this.vehicleService.applyVehicleConfiguration(vehicle, vehicleSpawn.modification);
        }

        this.vehicleService.syncVehicle(vehicle, vehicleSpawn.state);
    }

    @Rpc(RpcClientEvent.VEHICLE_DELETE)
    async deleteVehicle(netId: number) {
        if (!NetworkDoesNetworkIdExist(netId)) {
            return false;
        }

        const vehicle = NetworkGetEntityFromNetworkId(netId);

        if (!DoesEntityExist(vehicle)) {
            return false;
        }

        await this.vehicleService.getVehicleOwnership(vehicle, netId, 'deleting vehicle');

        SetEntityAsMissionEntity(vehicle, true, true);
        SetEntityAsNoLongerNeeded(vehicle);
        DeleteVehicle(vehicle);
        DeleteEntity(vehicle);

        return true;
    }
}
