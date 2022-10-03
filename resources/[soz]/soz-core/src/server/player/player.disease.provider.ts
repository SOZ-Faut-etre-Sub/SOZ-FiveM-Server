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
    public setPlayerDisease(source: number, disease: Disease, target?: number) {
        // Data from fivem can be wrongly typed, force false here
        if (!disease) {
            disease = false;
        }

        this.playerService.setPlayerDisease(target ? target : source, disease);
    }
}
