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
            return;
        }

        await emitRpc(RpcServerEvent.PHONE_SIMCARD_CALLS_INIT, phoneNumber);
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardCallsEnd)
    async onCallEnd(phoneNumber: string) {
        await emitRpc(RpcServerEvent.PHONE_SIMCARD_CALLS_END, phoneNumber);
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardCallsAccept)
    async onCallAccept(phoneNumber: string) {
        if (this.phoneState.isInCall() || this.playerService.getState().isDead) {
            return;
        }

        await emitRpc(RpcServerEvent.PHONE_SIMCARD_CALLS_ACCEPT, phoneNumber);
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardCallsDecline)
    async onCallDecline(phoneNumber: string) {
        await emitRpc(RpcServerEvent.PHONE_SIMCARD_CALLS_DECLINE, phoneNumber);
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardCallsMute)
    async onCallMute() {
        const muted = !(this.phoneState.getCurrentCall()?.muted ?? false);
        TriggerEvent(ClientEvent.VOIP_VOICE_MUTE_CALL, muted);

        this.phoneState.setCurrentCall({ ...this.phoneState.getCurrentCall(), muted });
        this.nuiDispatch.dispatch('phone', 'SetCurrentCall', this.phoneState.getCurrentCall());
    }

    @OnEvent(ClientEvent.VOIP_VOICE_START_CALL)
    @OnEvent(ClientEvent.VOIP_VOICE_END_CALL)
    async clearCallSounds() {
        this.nuiDispatch.dispatch('phone', 'SetDialSound', false);
        this.nuiDispatch.dispatch('phone', 'SetCallSound', false);
    }

    @OnEvent(ClientEvent.PHONE_SIMCARD_CALLS_INIT)
    async onCallInit() {
        this.nuiDispatch.dispatch('phone', 'OpenCallModal');
        this.nuiDispatch.dispatch('phone', 'SetDialSound', true);
    }

    @OnEvent(ClientEvent.PHONE_SIMCARD_CALLS_RECEIVE)
    async onCallReceive() {
        this.nuiDispatch.dispatch('phone', 'OpenCallModal');
        this.nuiDispatch.dispatch('phone', 'SetCallSound', true);
    }

    @OnEvent(ClientEvent.PHONE_SIMCARD_CALLS_UPDATE)
    async onCallUpdate(call: ActiveCall) {
        const muted = this.phoneState.getCurrentCall()?.muted ?? false;
        if (call !== null) {
            this.phoneState.setCurrentCall({ ...call, muted });
        } else {
            this.phoneState.setCurrentCall(null);
            this.clearCallSounds();
        }

        this.nuiDispatch.dispatch('phone', 'SetCurrentCall', this.phoneState.getCurrentCall());
    }
}
