import { Inject } from '@public/core/decorators/injectable';
import { Music } from '@public/shared/audio';

import { OnNuiEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { InputService } from '../nui/input.service';

@Provider()
export class AdminMenuMeteorProvider {
    @Inject(InputService)
    public inputService: InputService;

    @OnNuiEvent(NuiEvent.AdminMenuMeteorActivate)
    public async activateMeteor(): Promise<void> {
        const confirm = await this.inputService.askConfirm(`Êtes-vous sûr lancer le météor ? (OUI)`);

        if (!confirm) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_METEOR_ACTIVATE);
    }

    @OnNuiEvent(NuiEvent.AdminMenuMeteorMusic)
    public async activateMeteorMusic({ music, value }: { music: Music; value: number }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_METEOR_MUSIC, music, value);
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

    @OnNuiEvent(NuiEvent.AdminMenuWhatIfCinematic)
    public async whatIfCinematic(): Promise<void> {
        TriggerServerEvent(ServerEvent.WHAT_IF_CINEMATIC);
    }
}
