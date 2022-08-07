import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { PlayerService } from './player.service';

@Provider()
export class PlayerHealthProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Tick(60000)
    private async nutritionLoop(): Promise<void> {
        if (this.playerService.isLoggedIn()) {
            TriggerServerEvent('soz-core:server:player:nutrition:loop');
        }
    }

    @Tick(60 * 1000 * 60)
    private async nutritionCheck(): Promise<void> {
        if (this.playerService.isLoggedIn()) {
            TriggerServerEvent('soz-core:server:player:nutrition:check');
        }
    }
}
