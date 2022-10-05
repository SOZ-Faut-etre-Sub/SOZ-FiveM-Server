import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PlayerMetadata } from '../../shared/player';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';

@Provider()
export class AdminMenuPlayerProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.ADMIN_SET_HEALTH_METADATA)
    public async onSetHealthMetadata(source: number, target: number, key: keyof PlayerMetadata, value: number) {
        this.playerService.setPlayerMetadata(target, key, value);
    }

    @OnEvent(ServerEvent.ADMIN_RESET_SKIN)
    public async onResetSkin(source: number, target: number) {
        TriggerClientEvent(ClientEvent.CHARACTER_REQUEST_CHARACTER_WIZARD, target);
        this.notifier.notify(source, 'Le skin du joueur a été reset.');
    }
}
