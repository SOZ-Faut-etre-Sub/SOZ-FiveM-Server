import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Outfit } from '../../shared/cloth';
import { RpcServerEvent } from '../../shared/rpc';
import { PlayerService } from './player.service';

@Provider()
export class PlayerClothesProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Rpc(RpcServerEvent.PLAYER_CLOTHES_UPDATE)
    async onClothesUpdate(source: number, outfit: Outfit) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        this.playerService.updateClothConfig(source, 'BaseClothSet', outfit, false);
    }
}
