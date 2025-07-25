import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';

import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { RpcServerEvent } from '../../shared/rpc';
import { PlayerService } from '../player/player.service';

const MAX_PEOPLE_BY_FIRETRUCK = 5;

@Provider()
export class FireFiretruckProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    private lockedFiretrucks = new Map<number, Set<number>>();

    @Rpc(RpcServerEvent.FIRE_GET_LOCKED_FIRETRUCK)
    async getLockedFiretrucks(): Promise<Array<[number, number]>> {
        const players = [];

        this.lockedFiretrucks.forEach((player, firetruckNetId) =>
            player.forEach(p => players.push([p, firetruckNetId]))
        );

        return players;
    }

    @Rpc(RpcServerEvent.FIRE_LOCK_FIRETRUCK)
    public async onLock(source: number, entityNetId: number): Promise<boolean> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return false;
        }

        const players = this.lockedFiretrucks.get(entityNetId) || new Set<number>();

        for (const player of players) {
            if (!this.playerService.getPlayer(player)) {
                players.delete(player);
            }
        }

        if (players.size >= MAX_PEOPLE_BY_FIRETRUCK) {
            return false;
        }

        players.add(source);
        this.lockedFiretrucks.set(entityNetId, players);
        TriggerLatentClientEvent(ClientEvent.FIRE_HOSE_ATTACH_VEHICLE, -1, 16 * 1024, source, entityNetId);

        return true;
    }

    @Rpc(RpcServerEvent.FIRE_UNLOCK_FIRETRUCK)
    public async onUnlock(source: number, entityNetId: number) {
        const players = this.lockedFiretrucks.get(entityNetId) || new Set<number>();

        players.delete(source);
        TriggerLatentClientEvent(ClientEvent.FIRE_HOSE_DETACH_VEHICLE, -1, 16 * 1024, source, entityNetId);

        if (players.size === 0) {
            this.lockedFiretrucks.delete(entityNetId);
        } else {
            this.lockedFiretrucks.set(entityNetId, players);
        }
    }

    @OnEvent(ServerEvent.FIRE_HOSE_TRIGGER_SPRAY)
    async onSyncWaterHoseParticles(source: number, active: boolean) {
        TriggerLatentClientEvent(ClientEvent.FIRE_HOSE_TRIGGER_SPRAY, -1, 16 * 1024, source, active);
    }
}
