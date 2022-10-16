import { PlayerVehicle } from '@prisma/client';
import PCancelable from 'p-cancelable';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { uuidv4 } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Vector4 } from '../../shared/polyzone/vector';
import { getDefaultVehicleState, VehicleSpawn } from '../../shared/vehicle';
import { PlayerService } from '../player/player.service';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleSpawner {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private spawning: Record<string, (netId: number) => void> = {};
    private deleting: Record<string, () => void> = {};

    public async spawnPlayerVehicle(source: number, vehicle: PlayerVehicle): Promise<boolean> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return false;
        }

        const position = GetEntityCoords(GetPlayerPed(source)) as Vector4;

        return this.spawn(source, {
            model: parseInt(vehicle.hash, 10),
            position,
            warp: true,
            state: {
                ...getDefaultVehicleState(),
                open: true,
                owner: player.citizenid,
            },
        });
    }

    public async spawnTemporaryVehicle(source: number, model: string): Promise<boolean> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return false;
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
                owner: player.citizenid,
                open: true,
            },
        });
    }

    private async spawn(player: number, vehicle: VehicleSpawn): Promise<boolean> {
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
            this.vehicleStateService.registerSpawned(netId);

            return true;
        } catch (e) {
            console.error('Failed to spawn vehicle', e);

            return false;
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
