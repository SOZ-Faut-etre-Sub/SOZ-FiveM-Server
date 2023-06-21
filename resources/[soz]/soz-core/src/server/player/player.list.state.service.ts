import { Injectable } from '@core/decorators/injectable';

import { ClientEvent } from '../../shared/event';
import { PlayerClientState, PlayerData, PlayerListStateKey } from '../../shared/player';

@Injectable()
export class PlayerListStateService {
    private lists: Record<PlayerListStateKey, Set<number>> = {
        dead: new Set<number>(),
        zipped: new Set<number>(),
        wearingPatientOutfit: new Set<number>(),
    };

    public handlePlayer(player: PlayerData, playerState: PlayerClientState) {
        this.handle('dead', player.source, player.metadata.isdead);
        this.handle('zipped', player.source, playerState.isZipped);
        this.handle('wearingPatientOutfit', player.source, playerState.isWearingPatientOutfit);
    }

    public removePlayer(player: number) {
        this.handle('dead', player, false);
        this.handle('zipped', player, false);
        this.handle('wearingPatientOutfit', player, false);
    }

    private handle(key: PlayerListStateKey, player: number, status: boolean) {
        let updated = false;

        if (status && !this.lists[key].has(player)) {
            this.lists[key].add(player);
            updated = true;
        }

        if (!status && this.lists[key].has(player)) {
            this.lists[key].delete(player);
            updated = true;
        }

        if (updated) {
            TriggerClientEvent(ClientEvent.PLAYER_UPDATE_LIST_STATE, -1, key, Array.from(this.lists[key]));
        }
    }
}
