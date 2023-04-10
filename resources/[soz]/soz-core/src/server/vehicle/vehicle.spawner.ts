import { Logger } from '@core/logger';
import { emitClientRpc, emitClientRpcConfig } from '@core/rpc';
import { PlayerVehicle } from '@prisma/client';
import { DealershipConfig } from '@public/config/dealership';
import { GarageRepository } from '@public/server/repository/garage.repository';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { MultiZone } from '@public/shared/polyzone/multi.zone';
import { RpcClientEvent } from '@public/shared/rpc';

import { On, Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { uuidv4, wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Vector3, Vector4 } from '../../shared/polyzone/vector';
import { getDefaultVehicleConfiguration, VehicleConfiguration } from '../../shared/vehicle/modification';
import {
    getDefaultVehicleCondition,
    getDefaultVehicleState,
    VehicleEntityState,
    VehicleSpawn,
    VehicleType,
} from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { PlayerService } from '../player/player.service';
import { VehicleStateService } from './vehicle.state.service';

type ClosestVehicle = {
    vehicleNetworkId: number;
    vehicleEntityId: number;
    distance: number;
    isInside: boolean;
};

const VEHICLE_HAS_RADIO = [
    'ambulance',
    'ambcar',
    'firetruk',
    'mule6',
    'taco1',
    'dynasty2',
    'trash',
    'stockade',
    'baller8',
    'packer2',
    'utillitruck4',
    'flatbed3',
    'flatbed4',
    'burito6',
    'newsvan',
    'frogger3',
    'police',
    'police2',
    'police3',
    'police4',
    'police5',
    'police6',
    'policeb2',
    'lspdbana1',
    'lspdbana2',
    'sheriff',
    'sheriff2',
    'sheriff3',
    'sheriff4',
    'sheriffb',
    'sheriffdodge',
    'sheriffcara',
    'bcsobana1',
    'bcsobana2',
    'maverick2',
    'pbus',
    'polmav',
    'fbi',
    'fbi2',
    'cogfbi',
    'paragonfbi',
    'sadler1',
    'hauler1',
    'brickade1',
    'boxville',
    'youga3',
    'rumpo4',
];

@Provider()
export class VehicleSpawner {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Logger)
    private logger: Logger;

    @Inject(GarageRepository)
    private garageRepository: GarageRepository;

    private closestVehicleResolver: Record<string, (closestVehicle: null | ClosestVehicle) => void> = {};

    private noSpawnZone: MultiZone<BoxZone> = new MultiZone<BoxZone>([]);

    @Once(OnceStep.RepositoriesLoaded)
    public async onInit() {
        const garages = await this.garageRepository.get();
        const noSpawnZones = [];

        for (const garage of Object.values(garages)) {
            noSpawnZones.push(...garage.parkingPlaces);
        }

        for (const dealership of Object.values(DealershipConfig)) {
            noSpawnZones.push(BoxZone.default(dealership.showroom.position, 10, 10));
        }

        this.noSpawnZone = new MultiZone<BoxZone>(noSpawnZones);
    }

    @On('entityCreating', false)
    public async handleNoSpawnZone(entity: number) {
        const position = GetEntityCoords(entity, false) as Vector3;
        const entityType = GetEntityType(entity);
        const scriptType = GetEntityPopulationType(entity);

        if (entityType !== 2) {
            return;
        }

        if (scriptType === 7) {
            return;
        }

        if (this.noSpawnZone.isPointInside(position)) {
            CancelEvent();
        }
    }

    @OnEvent(ServerEvent.VEHICLE_FREE_JOB_SPAWN)
    private async onVehicleServerSpawn(source: number, model: string, position: Vector4, event: string) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return null;
        }

        const modelHash = GetHashKey(model);
        const vehicleNetId = await this.spawn(source, {
            hash: modelHash,
            model,
            position,
            warp: false,
            state: {
                ...getDefaultVehicleState(),
                isPlayerVehicle: true,
                owner: player.citizenid,
                open: true,
            },
        });

        TriggerClientEvent(event, source, vehicleNetId);
    }

    public async getClosestVehicle(source: number): Promise<null | ClosestVehicle> {
        let reject: (reason?: any) => void;
        const id = uuidv4();
        const promise = new Promise<null | ClosestVehicle>((res, rej) => {
            this.closestVehicleResolver[id] = res;
            reject = rej;
        });

        setTimeout(() => {
            if (this.closestVehicleResolver[id]) {
                reject(new Error('timeout error when acquiring vehicle'));
            }
        }, 10000);

        TriggerClientEvent(ClientEvent.VEHICLE_GET_CLOSEST, source, id);

        return promise;
    }

    @OnEvent(ServerEvent.VEHICLE_SWAP)
    private async onVehicleSwap(
        source: number,
        originalNetworkId: number,
        newNetworkId: number,
        state: VehicleEntityState
    ) {
        await wait(200);

        let entityId = NetworkGetEntityFromNetworkId(newNetworkId);

        while (!entityId || !DoesEntityExist(entityId)) {
            entityId = NetworkGetEntityFromNetworkId(newNetworkId);
            await wait(0);
        }

        this.vehicleStateService.updateVehicleState(entityId, state);
        this.vehicleStateService.registerSpawned(newNetworkId);

        await this.delete(originalNetworkId);
    }

    @OnEvent(ServerEvent.VEHICLE_SET_CLOSEST)
    private onVehicleClosest(
        source: number,
        id: string,
        vehicleNetworkId: number,
        distance: number,
        isInside: boolean
    ) {
        if (this.closestVehicleResolver[id]) {
            if (vehicleNetworkId) {
                const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

                this.closestVehicleResolver[id]({
                    vehicleNetworkId,
                    vehicleEntityId: entityId,
                    distance,
                    isInside,
                });
            } else {
                this.closestVehicleResolver[id](null);
            }

            delete this.closestVehicleResolver[id];
        }
    }

    public async spawnPlayerVehicle(source: number, vehicle: PlayerVehicle, position: Vector4): Promise<null | number> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return null;
        }

        const state = {
            ...getDefaultVehicleState(),
            condition: {
                ...getDefaultVehicleCondition(),
                ...JSON.parse(vehicle.condition || '{}'),
            },
            isPlayerVehicle: true,
            plate: vehicle.plate,
            id: vehicle.id,
            open: false,
            owner: player.citizenid,
            defaultOwner: vehicle.citizenid,
        };

        const hash = parseInt(vehicle.hash || '0', 10);

        if (!hash) {
            return null;
        }

        return this.spawn(source, {
            hash,
            model: vehicle.vehicle,
            position,
            warp: false,
            modification: {
                ...getDefaultVehicleConfiguration(),
                ...(JSON.parse(vehicle.mods || '{}') as VehicleConfiguration),
            },
            state,
        });
    }

    public async spawnTemporaryVehicle(source: number, model: string): Promise<null | number> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return null;
        }

        const position = GetEntityCoords(GetPlayerPed(source)) as Vector4;
        position[3] = GetEntityHeading(GetPlayerPed(source));

        const modelHash = GetHashKey(model);

        return this.spawn(source, {
            hash: modelHash,
            model,
            position,
            warp: true,
            state: {
                ...getDefaultVehicleState(),
                isPlayerVehicle: true,
                owner: player.citizenid,
                open: true,
            },
        });
    }

    private async spawn(player: number, vehicle: VehicleSpawn): Promise<number | null> {
        const radio = VEHICLE_HAS_RADIO.includes(vehicle.model);

        try {
            let [netId, entityId] = await this.spawnVehicleFromClient(player, vehicle);

            if (!netId || !entityId) {
                [netId, entityId] = await this.spawnVehicleFromServer(player, vehicle);
            }

            if (!netId || !entityId) {
                return null;
            }

            const scriptType = GetEntityPopulationType(entityId);
            const model = GetEntityModel(entityId);

            if (scriptType !== 7 || model !== vehicle.hash) {
                this.logger.error(
                    `Failed to spawn vehicle ${vehicle.model} (${vehicle.hash}), another entity spawn for this net id, network entity id: ${netId}, entity id: ${entityId}, script type: ${scriptType}, model: ${model}`
                );

                return null;
            }

            this.vehicleStateService.registerSpawned(netId);
            this.vehicleStateService.updateVehicleState(entityId, {
                ...vehicle.state,
                spawned: true,
                hasRadio: radio,
                radioInUse: false,
                radioEnabled: false,
                primaryRadio: radio
                    ? {
                          frequency: 0.0,
                          volume: 100,
                          ear: 1,
                      }
                    : null,
                secondaryRadio: radio
                    ? {
                          frequency: 0.0,
                          volume: 100,
                          ear: 1,
                      }
                    : null,
            });

            return netId;
        } catch (e) {
            this.logger.error('failed to spawn vehicle', e);

            return null;
        }
    }

    private async spawnVehicleFromClient(player: number, vehicle: VehicleSpawn): Promise<[number, number]> {
        let netId = await emitClientRpcConfig<number | null>(
            RpcClientEvent.VEHICLE_SPAWN,
            player,
            { timeout: 10000, retries: 0 },
            vehicle
        );

        if (!netId) {
            this.logger.error(`failed to spawn vehicle ${vehicle.model} (${vehicle.hash}) from client, no network id`);

            return [0, 0];
        }

        // await some frame to be nice with state bag
        // @see https://github.com/citizenfx/fivem/pull/1382
        await wait(200);

        let entityId = NetworkGetEntityFromNetworkId(netId);

        if (!entityId || !DoesEntityExist(entityId)) {
            this.logger.error(
                `failed to spawn vehicle ${vehicle.model} (${vehicle.hash}), entity does not exist on server,network entity id: ${netId}, entity id: ${entityId}`
            );

            // Try to get again the network id
            netId = await emitClientRpc<number | null>(RpcClientEvent.GET_LAST_VEHICLE_SPAWN, player, vehicle);

            if (!netId) {
                this.logger.error(
                    `failed to spawn vehicle ${vehicle.model} (${vehicle.hash}) from client, no network id, even after retrying`
                );

                return [0, 0];
            }

            entityId = NetworkGetEntityFromNetworkId(netId);

            if (!entityId || !DoesEntityExist(entityId)) {
                this.logger.error(
                    `failed to spawn vehicle ${vehicle.model} (${vehicle.hash}), entity does not exist on server,network entity id: ${netId}, entity id: ${entityId}, even after retrying`
                );

                await emitClientRpc(RpcClientEvent.DELETE_LAST_VEHICLE_SPAWN, player, vehicle);

                return [0, 0];
            }

            this.logger.error(
                `Vehicle has finally been spawned ${vehicle.model} (${vehicle.hash}), network entity id: ${netId}, entity id: ${entityId}`
            );
        }

        return [netId, entityId];
    }

    private async spawnVehicleFromServer(player: number, vehicle: VehicleSpawn): Promise<[number, number]> {
        const type = await emitClientRpc<VehicleType>(RpcClientEvent.VEHICLE_GET_TYPE, player, vehicle.hash);

        if (!type) {
            this.logger.error(`failed to spawn vehicle ${vehicle.model} (${vehicle.hash}) from server, no type`);

            return [0, 0];
        }

        const entity = CreateVehicleServerSetter(
            vehicle.hash,
            type,
            vehicle.position[0],
            vehicle.position[1],
            vehicle.position[2],
            vehicle.position[3]
        );

        if (!entity) {
            this.logger.error(`failed to spawn vehicle ${vehicle.model} (${vehicle.hash}) from server, no entity`);

            return [0, 0];
        }

        if (!DoesEntityExist(entity)) {
            this.logger.error(`failed to spawn vehicle ${vehicle.model} (${vehicle.hash}) from server, no entity`);

            return [0, 0];
        }

        const networkId = NetworkGetNetworkIdFromEntity(entity);
        let owner = NetworkGetEntityOwner(entity);
        let tryCount = 0;

        // Wait for the entity to be owned by a player, (wait for a maximum of 100 frames)
        while (owner === -1 && tryCount < 100) {
            await wait(0);
            owner = NetworkGetEntityOwner(entity);
            tryCount++;
        }

        if (owner === -1) {
            this.logger.error(`failed to spawn vehicle ${vehicle.model} (${vehicle.hash}) from server, no owner`);

            return [0, 0];
        }

        this.logger.info(
            `Vehicle ${vehicle.model} (${vehicle.hash}) spawned from server, network entity id: ${networkId}, entity id: ${entity}, owner: ${owner}, in ${tryCount} frames`
        );

        const initialized = await emitClientRpc<boolean>(
            RpcClientEvent.VEHICLE_SPAWN_FROM_SERVER,
            owner,
            networkId,
            vehicle
        );

        if (!initialized) {
            this.logger.error(
                `failed to spawn vehicle ${vehicle.model} (${vehicle.hash}) from server, not initialized`
            );

            return [0, 0];
        }

        return [networkId, entity];
    }

    public async delete(netId: number): Promise<boolean> {
        const entityId = NetworkGetEntityFromNetworkId(netId);
        let owner = NetworkGetEntityOwner(entityId);

        this.vehicleStateService.unregisterSpawned(netId);

        try {
            let deleted = await emitClientRpc<boolean>(RpcClientEvent.VEHICLE_DELETE, owner, netId);
            let deleteTry = 0;

            while (!deleted && deleteTry < 10) {
                owner = NetworkGetEntityOwner(entityId);
                deleted = await emitClientRpc<boolean>(RpcClientEvent.VEHICLE_DELETE, owner, netId);
                deleteTry++;

                await wait(100);
            }

            if (!deleted && DoesEntityExist(entityId)) {
                this.logger.error(`failed to delete vehicle with netId: ${netId}, use server delete`);

                DeleteEntity(entityId);
                deleted = DoesEntityExist(entityId);
            }

            return deleted;
        } catch (e) {
            this.logger.error(`failed to delete vehicle with netId: ${netId}: ${e.toString()}`);

            return false;
        }
    }
}
