import { Inject } from '@public/core/decorators/injectable';

import { OnNuiEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { InputService } from '../nui/input.service';

@Provider()
export class AdminMenuMeteorProvider {
    @Inject(InputService)
    public inputService: InputService;

    @OnNuiEvent(NuiEvent.AdminMenuMeteorSiren)
    public async toggleSiren(value: number): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_SIREN, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMeteorActivate)
    public async activateMeteor(): Promise<void> {
        const confirm = await this.inputService.askConfirm(`Êtes-vous sûr lancer le météor ? (OUI)`);

        if (!confirm) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_METEOR_ACTIVATE);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMeteorMusic)
    public async activateMeteorMusic(value: number): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_MUSIC, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMeteorKickPlayers)
    public async kickPlayers(): Promise<void> {
        const confirm = await this.inputService.askConfirm(`Êtes-vous sûr de kick les joueurs ? (OUI)`);

        if (!confirm) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_METEOR_KICK_PLAYERS);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMeteorDisableNpc)
    public async disableNPC(value: boolean): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_DISABLE_NPC, value);
    }
}
