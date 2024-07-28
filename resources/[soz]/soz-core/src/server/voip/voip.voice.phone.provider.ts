import { On, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { uuidv4 } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { Monitor } from '../monitor/monitor';
import { PlayerService } from '../player/player.service';
import { StateSelector, Store } from '../store/store';

type Call = {
    id: string;
    callerId: number;
    callerPhone: string;
    receiverId: number;
    receiverPhone: string;
};

@Provider()
export class VoipVoicePhoneProvider {
    @Inject('Store')
    private store: Store;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Monitor)
    private monitor: Monitor;

    private calls = new Map<string, Call>();

    @StateSelector(state => state.global.blackoutLevel)
    public stopPhoneCallOnLevel(level: number) {
        if (level > 2) {
            this.calls.forEach(call => {
                this.stopCall(call.id);
            });
        }
    }

    @OnEvent(ServerEvent.VOIP_PHONE_CALL_START)
    public startCall(_source: number, callerPhone: string, receiverPhone: string) {
        const blackout = this.store.getState().global.blackout;
        const blackoutLevel = this.store.getState().global.blackoutLevel;

        if (blackout || blackoutLevel > 2) {
            return;
        }

        const caller = this.playerService.getPlayerByPhone(callerPhone);
        const receiver = this.playerService.getPlayerByPhone(receiverPhone);

        if (!caller || !receiver) {
            return;
        }

        const existingCall = Array.from(this.calls.values()).find(
            call => call.callerPhone === callerPhone || call.receiverPhone === receiverPhone
        );

        if (existingCall) {
            return;
        }

        const callId = uuidv4();

        const call: Call = {
            id: callId,
            callerId: caller.source,
            callerPhone,
            receiverId: receiver.source,
            receiverPhone,
        };

        this.calls.set(callId, call);

        TriggerClientEvent(ClientEvent.VOIP_VOICE_START_CALL, caller.source, receiver.source);
        TriggerClientEvent(ClientEvent.VOIP_VOICE_START_CALL, receiver.source, caller.source);
    }

    @OnEvent(ServerEvent.VOIP_PHONE_CALL_END)
    public endCall(source: number, target: number | null = null) {
        let player = target ? this.playerService.getPlayer(target) : null;

        if (!player) {
            player = this.playerService.getPlayer(source);
        }

        if (!player) {
            return;
        }

        const call = Array.from(this.calls.values()).find(
            call => call.callerId === player.source || call.receiverId === player.source
        );

        if (!call) {
            return;
        }

        this.stopCall(call.id);
    }

    private stopCall(callId: string) {
        const call = this.calls.get(callId);

        if (!call) {
            return;
        }

        TriggerClientEvent(ClientEvent.VOIP_VOICE_END_CALL, call.callerId);
        TriggerClientEvent(ClientEvent.VOIP_VOICE_END_CALL, call.receiverId);

        this.calls.delete(call.id);
    }

    @On('playerDropped')
    public onPlayerDroppedPhone(source: number) {
        this.endCall(source);
    }
}
