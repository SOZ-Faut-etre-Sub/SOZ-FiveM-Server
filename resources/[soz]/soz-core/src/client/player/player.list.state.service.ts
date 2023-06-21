import { Injectable } from '@core/decorators/injectable';
import { PlayerListStateKey } from '@public/shared/player';

@Injectable()
export class PlayerListStateService {
    private lists: Record<PlayerListStateKey, Set<number>> = {
        dead: new Set<number>(),
        zipped: new Set<number>(),
        wearingPatientOutfit: new Set<number>(),
    };

    public updateList(key: PlayerListStateKey, players: number[]) {
        this.lists[key] = new Set(players);
    }

    public isDead(player: number) {
        return this.lists.dead.has(player);
    }

    public isZipped(player: number) {
        return this.lists.zipped.has(player);
    }

    public isWearingPatientOutfit(player: number) {
        return this.lists.wearingPatientOutfit.has(player);
    }
}
