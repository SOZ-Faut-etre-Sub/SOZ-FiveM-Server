import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';

@Provider()
export class AdminMenuMeteorProvider {
    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @OnNuiEvent(NuiEvent.AdminMenuMeteorToggleSiren)
    public async toggleSiren(value: boolean): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_SIREN_TOOGLE, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMeteorActivateMeteor)
    public async activateMeteor(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_ACTIVATE);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMeteorActivateMusic)
    public async activateMeteorMusic(value: boolean): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_MUSIC_ACTIVATE, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMeteorKickPlayers)
    public async kickPlayers(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_KICK_PLAYERS);
    }
}
