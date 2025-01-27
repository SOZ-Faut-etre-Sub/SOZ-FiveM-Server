import { Provider } from '@public/core/decorators/provider';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { ClientEvent } from '../../../shared/event/client';
import { VoiceListeningService } from './voice.listening.service';
import { VoiceTargetService } from './voice.target.service';

@Provider()
export class VoicePhoneProvider {
    @Inject(VoiceTargetService)
    private voiceTargetService: VoiceTargetService;

    @Inject(VoiceListeningService)
    private voiceListeningService: VoiceListeningService;

    private currentCallerId: number | null = null;

    public hasActiveCall(): boolean {
        return this.currentCallerId !== null;
    }

    @OnEvent(ClientEvent.VOIP_VOICE_START_CALL)
    public onStartCall(callerId: number) {
        if (this.currentCallerId !== null) {
            this.voiceTargetService.removePlayer(this.currentCallerId, 'phone');
            this.voiceListeningService.removePlayerAudioContext(this.currentCallerId, 'phone');
        }

        this.currentCallerId = callerId;

        this.voiceTargetService.addPlayer(callerId, 'phone');
        this.voiceListeningService.addPlayerAudioContext(callerId, 'phone', {
            type: 'phone',
            priority: 1,
        });
    }

    @OnEvent(ClientEvent.VOIP_VOICE_END_CALL)
    public onEndCall() {
        if (this.currentCallerId !== null) {
            this.voiceListeningService.removePlayerAudioContext(this.currentCallerId, 'phone');
            this.voiceTargetService.removePlayer(this.currentCallerId, 'phone');
        }

        this.currentCallerId = null;
    }

    @OnEvent(ClientEvent.VOIP_VOICE_MUTE_CALL)
    public onMuteCall(isMuted: boolean) {
        if (this.currentCallerId === null) {
            return;
        }

        // This event is received by the person that did not mute the call, so we remove the caller from the context
        if (isMuted) {
            this.voiceListeningService.removePlayerAudioContext(this.currentCallerId, 'phone');
        } else {
            this.voiceListeningService.addPlayerAudioContext(this.currentCallerId, 'phone', {
                type: 'phone',
                priority: 1,
            });
        }
    }
}
