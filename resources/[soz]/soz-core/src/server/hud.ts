import { Inject, Injectable } from '../core/decorators/injectable';
import { PlayerService } from './player/player.service';

@Injectable()
export class Hud {
    @Inject(PlayerService)
    private playerService: PlayerService;

    public updateNeeds(source: number): void {
        const updatedPlayer = this.playerService.getPlayer(source);

        TriggerClientEvent(
            'hud:client:UpdateNeeds',
            source,
            updatedPlayer.metadata.hunger,
            updatedPlayer.metadata.thirst,
            updatedPlayer.metadata.alcohol,
            updatedPlayer.metadata.drug
        );
    }
}
