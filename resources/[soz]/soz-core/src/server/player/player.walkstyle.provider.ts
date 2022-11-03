import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PlayerService } from './player.service';

@Provider()
export class PlayerWalkstyleProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @OnEvent(ServerEvent.PLAYER_SET_CURRENT_WALKSTYLE)
    async setPlayerWalkStyle(source: number, walkstyle: string | null) {
        // Data from fivem can be wrongly typed, force false here
        if (!walkstyle) {
            walkstyle = '';
        }

        this.playerService.setPlayerMetadata(source, 'walk', walkstyle);
        TriggerClientEvent(ClientEvent.PLAYER_UPDATE_WALK_STYLE, source, walkstyle);
    }
}
