import { PlayerVehicle } from '@prisma/client';
import PCancelable from 'p-cancelable';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { uuidv4, wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Vector4 } from '../../shared/polyzone/vector';
import { getDefaultVehicleModification, VehicleConfiguration } from '../../shared/vehicle/modification';
import { getDefaultVehicleCondition, getDefaultVehicleState, VehicleSpawn } from '../../shared/vehicle/vehicle';
import { PlayerService } from '../player/player.service';
import { VehicleStateService } from './vehicle.state.service';

type ClosestVehicle = {
    vehicleNetworkId: number;
    vehicleEntityId: number;
    distance: number;
    isInside: boolean;
};

@Provider()
export class VehicleSpawner {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private spawning: Record<string, (netId: number) => void> = {};
    private deleting: Record<string, () => void> = {};

    private closestVehicleResolver: Record<string, (closestVehicle: null | ClosestVehicle) => void> = {};

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
            open: true,
            owner: player.citizenid,
        };

        const hash = parseInt(vehicle.hash || '0', 10);

        if (!hash) {
            return null;
        }

        return this.spawn(source, {
            model: hash,
            position,
            warp: false,
            modification: {
                ...getDefaultVehicleModification(),
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
            model: modelHash,
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

            this.vehicleStateService.updateVehicleState(entityId, vehicle.state);
            this.vehicleStateService.registerSpawned(netId);

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
        const owner = NetworkGetEntityOwner(entityId);
        const deletePromise = new PCancelable<void>(resolve => {
            this.deleting[netId] = resolve;
        });

        // Cancel delete after 10 seconds
        setTimeout(() => {
            try {
                deletePromise.cancel();
            } catch {
                // do nothing
            }
        }, 10000);

        TriggerClientEvent(ClientEvent.VEHICLE_DELETE, owner, netId);

        try {
            await deletePromise;

            this.vehicleStateService.unregisterSpawned(netId);

            return true;
        } catch (e) {
            console.error('Failed to delete vehicle', e);
            return false;
        } finally {
            delete this.deleting[netId];
        }
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
