import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { RpcServerEvent } from '../../shared/rpc';
import { PlayerService } from '../player/player.service';
import { TcgService } from './tcg.service';

@Provider()
export class TcgProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(TcgService)
    private readonly tcgService: TcgService;

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_DAILY_STATUS)
    async getDailyStatus(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return null;
        }

        return this.tcgService.getDailyStatus(player.citizenid);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_CLAIM_DAILY_CARDS)
    async claimDailyCards(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return { success: false, cards: [], remainingToday: 0, message: 'Joueur introuvable.' };
        }

        return this.tcgService.claimDailyCards(player.citizenid);
    }

    @Rpc(RpcServerEvent.PHONE_APP_TCG_GET_COLLECTION)
    async getCollection(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return [];
        }

        return this.tcgService.getCollection(player.citizenid);
    }
}
