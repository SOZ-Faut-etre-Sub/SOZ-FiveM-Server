import { PlayerVehicle } from '@prisma/client';
import PCancelable from 'p-cancelable';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { uuidv4, wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Vector4 } from '../../shared/polyzone/vector';
import { getDefaultVehicleConfiguration, VehicleConfiguration } from '../../shared/vehicle/modification';
import {
    getDefaultVehicleCondition,
    getDefaultVehicleState,
    VehicleEntityState,
    VehicleSpawn,
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
    'sheriff',
    'sheriff2',
    'sheriff3',
    'sheriff4',
    'sheriffb',
    'sheriffdodge',
    'sheriffcara',
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

    private spawning: Record<string, (netId: number) => void> = {};
    private deleting: Record<string, () => void> = {};

    private closestVehicleResolver: Record<string, (closestVehicle: null | ClosestVehicle) => void> = {};

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
        this.vehicleStateService.registerSpawned(newNetworkId);

        await wait(200);

        let entityId = NetworkGetEntityFromNetworkId(newNetworkId);

        while (!entityId || !DoesEntityExist(entityId)) {
            entityId = NetworkGetEntityFromNetworkId(newNetworkId);
            await wait(0);
        }

        this.vehicleStateService.updateVehicleState(entityId, state);

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
        const spawnId = uuidv4();
        const promise = new PCancelable<number>(resolve => {
            this.spawning[spawnId] = resolve;
        });

        const radio = VEHICLE_HAS_RADIO.includes(vehicle.model);

        // Cancel spawn after 10 seconds
        setTimeout(() => {
            try {
                promise.cancel();
            } catch {
                // do nothing
            }
        }, 10000);

        TriggerClientEvent(ClientEvent.VEHICLE_SPAWN, player, spawnId, vehicle);

        try {
            const netId = await promise;

            // await some frame to be nice with state bag
            // @see https://github.com/citizenfx/fivem/pull/1382
            await wait(200);

            let entityId = NetworkGetEntityFromNetworkId(netId);

            while (!entityId || !DoesEntityExist(entityId)) {
                entityId = NetworkGetEntityFromNetworkId(netId);
                await wait(0);
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
            console.error('Failed to spawn vehicle', e);

            return null;
        } finally {
            delete this.spawning[spawnId];
        }
    }

    public async delete(netId: number): Promise<boolean> {
        const entityId = NetworkGetEntityFromNetworkId(netId);
        let owner = NetworkGetEntityOwner(entityId);
        this.vehicleStateService.unregisterSpawned(netId);
        const deletePromise = new PCancelable<void>(resolve => {
            this.deleting[netId] = resolve;
        });

        // Be nice if there was an active check
        await wait(200);

        let deleted = false;
        let deleteTry = 0;

        while (!deleted && deleteTry < 600) {
            // Maybe owner change during delete
            owner = NetworkGetEntityOwner(entityId);

            setTimeout(() => {
                try {
                    deletePromise.cancel();
                } catch {
                    // do nothing
                }
            }, 10000);

            TriggerClientEvent(ClientEvent.VEHICLE_DELETE, owner, netId);
            await deletePromise;

            try {
                await deletePromise;
                deleted = true;
                deleteTry++;
            } catch (e) {
                console.error('Failed to delete vehicle with netId', netId, e);
            }

            // Try to delete entity on server side
            if (!deleted && DoesEntityExist(entityId)) {
                DeleteEntity(entityId);
                deleted = DoesEntityExist(entityId);
            }
        }

        delete this.deleting[netId];

        return deleted;
    }

    @OnEvent(ServerEvent.VEHICLE_SPAWNED)
    private onVehicleSpawned(source: number, spawnId: string, netId: number): void {
        const resolve = this.spawning[spawnId];

        if (resolve) {
            resolve(netId);
        }
    }

    @OnEvent(ServerEvent.VEHICLE_DELETED)
    private onVehicleDeleted(source: number, netId: number): void {
        const resolve = this.deleting[netId];

        if (resolve) {
            resolve();
        }
    }
}
