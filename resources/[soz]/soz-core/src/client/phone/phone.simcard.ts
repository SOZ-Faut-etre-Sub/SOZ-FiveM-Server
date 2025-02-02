import { Provider } from '@core/decorators/provider';
import { Inject } from '@public/core/decorators/injectable';

import { SocietyNumberList } from '../../config/phone';
import { On, Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { emitRpc } from '../../core/rpc';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { RpcServerEvent } from '../../shared/rpc';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';

@Provider()
export class PhoneSimCard {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Once(OnceStep.NuiLoaded)
    @OnEvent(ClientEvent.ADMIN_SWITCH_CHARACTER)
    async onNuiLoaded() {
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        this.nuiDispatch.dispatch('phone', 'SetSimCard', player.charinfo.phone);
        this.nuiDispatch.dispatch('phone', 'SetSocietySimCard', SocietyNumberList[player.job.id]);

        const avatar = await emitRpc<string>(RpcServerEvent.PHONE_SIMCARD_GET_AVATAR);
        this.nuiDispatch.dispatch('phone', 'SetSimCardAvatar', avatar);
    }

    @On('QBCore:Client:OnJobUpdate')
    async onJobUpdate({ id }: { id: string }) {
        this.nuiDispatch.dispatch('phone', 'SetSocietySimCard', SocietyNumberList[id]);
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardUpdateAvatar)
    async onUpdateAvatar({ avatar }: { avatar: string }) {
        await emitRpc(RpcServerEvent.PHONE_SIMCARD_UPDATE_AVATAR, avatar);
        this.nuiDispatch.dispatch('phone', 'SetSimCardAvatar', avatar);
    }
}
