import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { CardType } from '../../shared/nui/card';
import { PlayerService } from './player.service';

@Provider()
export class PlayerIdentityProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @OnEvent(ServerEvent.PLAYER_SHOW_IDENTITY)
    public showIdentity(type: CardType, targets: number[]) {
        for (const target of targets) {
            const player = this.playerService.getPlayer(target);

            TriggerClientEvent(ClientEvent.PLAYER_SHOW_IDENTITY, target, type, player);
        }
    }
}
