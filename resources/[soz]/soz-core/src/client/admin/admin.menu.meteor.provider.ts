import { OnNuiEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';

@Provider()
export class AdminMenuMeteorProvider {
    @OnNuiEvent(NuiEvent.AdminMenuMeteorSiren)
    public async toggleSiren(value: number): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_SIREN, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMeteorActivate)
    public async activateMeteor(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_ACTIVATE);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMeteorMusic)
    public async activateMeteorMusic(value: number): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_MUSIC, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMeteorKickPlayers)
    public async kickPlayers(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_KICK_PLAYERS);
    }
}
