import { Provider } from '@core/decorators/provider';
import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { ClientEvent } from '@public/shared/event/client';
import { ActiveCall } from '@public/shared/phone/simcard';

import { Inject } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { NuiEvent } from '../../shared/event/nui';
import { RpcServerEvent } from '../../shared/rpc';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { PhoneState } from './phone.state';

@Provider()
export class PhoneSimCardCalls {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(PhoneState)
    private readonly phoneState: PhoneState;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @OnNuiEvent(NuiEvent.PhoneSimCardCallsInit)
    async onCallsInit(phoneNumber: string) {
        if (this.phoneState.isInCall() || this.playerService.getState().isDead) {
            console.error(this.phoneState.isInCall(), this.playerService.getState().isDead);
            return;
        }

        await emitRpc(RpcServerEvent.PHONE_SIMCARD_CALLS_INIT, phoneNumber);
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardCallsMute)
    async onCallMute() {
        TriggerEvent(ClientEvent.VOIP_VOICE_MUTE_CALL, this.phoneState.getCurrentCall()?.muted ?? false);
    }

    @OnEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE)
    async onCallUpdate(call: ActiveCall) {
        const muted = this.phoneState.getCurrentCall()?.muted ?? false;
        this.phoneState.setCurrentCall({ ...call, muted });

        this.nuiDispatch.dispatch('phone', 'SetCurrentCall', this.phoneState.getCurrentCall());
    }
}
