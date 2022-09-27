import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Disease } from '../../shared/disease';
import { ServerEvent } from '../../shared/event';
import { PlayerService } from './player.service';

@Provider()
export class PlayerDiseaseProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @OnEvent(ServerEvent.PLAYER_SET_CURRENT_DISEASE)
    public setPlayerDisease(source: number, disease: Disease | false) {
        this.playerService.setPlayerDisease(source, disease);
    }
}
