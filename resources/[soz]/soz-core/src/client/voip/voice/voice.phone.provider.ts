import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Tick } from '@core/decorators/tick';
import { Provider } from '@public/core/decorators/provider';
import { ClientEvent } from '@public/shared/event/client';
import { ServerEvent } from '@public/shared/event/server';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';

import { VoiceListeningService } from './voice.listening.service';
import { VoiceTargetService } from './voice.target.service';

@Provider()
export class VoicePhoneProvider {
    @Inject(VoiceTargetService)
    private voiceTargetService: VoiceTargetService;

    @Inject(VoiceListeningService)
    private voiceListeningService: VoiceListeningService;

    private currentCallerId: number | null = null;
    private currentSpeakerIds = new Set<number>();

    private speakerEnabled: boolean = false;
    private currentProximityPlayers = new Set<number>();

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
        this.speakerEnabled = false;
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

    @OnEvent(ClientEvent.VOIP_VOICE_SPEAKER_CALL)
    public enableSpeakerCall(enabled: boolean) {
        this.speakerEnabled = enabled;
    }

    @OnEvent(ClientEvent.VOIP_VOICE_SPEAKER_LISTENING_CALL)
    public onSpeakerCall(callerId: number, enabled: boolean) {
        const exists = this.currentSpeakerIds.has(callerId);

        if (exists === enabled) return;

        if (enabled) {
            this.voiceTargetService.addPlayer(callerId, 'phone_speaker');
            this.voiceListeningService.addPlayerAudioContext(callerId, 'phone_speaker', {
                type: 'phone_speaker',
                priority: 2,
            });
            this.currentSpeakerIds.add(callerId);
        } else {
            this.voiceListeningService.removePlayerAudioContext(callerId, 'phone_speaker');
            this.voiceTargetService.removePlayer(callerId, 'phone_speaker');
            this.currentSpeakerIds.delete(callerId);
        }
    }

    @Tick()
    public checkProximityPlayers() {
        if (!this.speakerEnabled && this.currentProximityPlayers.size === 0) return;

        const players = GetActivePlayers();
        const currentPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const selfPlayerId = GetPlayerServerId(PlayerId());
        const newProximityPlayers = new Set<number>();

        for (const player of players) {
            if (!this.speakerEnabled) {
                continue;
            }

            const serverId = GetPlayerServerId(player);
            if (!serverId) {
                continue;
            }

            if (serverId === selfPlayerId) {
                continue;
            }

            const playerPed = GetPlayerPed(player);
            const playerPosition = GetEntityCoords(playerPed, false) as Vector3;
            const distance = getDistance(currentPosition, playerPosition);

            if (distance > 5) {
                continue;
            }

            newProximityPlayers.add(serverId);
        }

        // get diff
        const leftPlayers = new Set([...this.currentProximityPlayers].filter(x => !newProximityPlayers.has(x)));
        const newPlayers = new Set([...newProximityPlayers].filter(x => !this.currentProximityPlayers.has(x)));

        // remove players from audio context
        for (const player of leftPlayers) {
            TriggerServerEvent(ServerEvent.VOIP_PHONE_CALL_SPEAKER_LISTENER_REMOVE, player);
        }

        if (!this.speakerEnabled) {
            this.currentProximityPlayers.clear();
            return;
        }

        // add players to audio context
        for (const player of newPlayers) {
            TriggerServerEvent(ServerEvent.VOIP_PHONE_CALL_SPEAKER_LISTENER_ADD, player);
        }

        this.currentProximityPlayers = newProximityPlayers;
    }
}
