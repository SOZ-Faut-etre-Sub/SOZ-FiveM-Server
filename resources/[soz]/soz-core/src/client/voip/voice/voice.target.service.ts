import { Injectable } from '../../../core/decorators/injectable';
import { AudioContextType, VOICE_TARGET } from '../../../shared/voip';

/**
 * Service that handles the target of voice
 *
 * This handle to which player the voice should be sent
 */

@Injectable()
export class VoiceTargetService {
    private players: Map<number, AudioContextType[]> = new Map();

    public getTargets(): Record<number, AudioContextType[]> {
        const targets: Record<number, AudioContextType[]> = {};

        for (const [playerId, audioContextTypes] of this.players) {
            targets[playerId] = audioContextTypes;
        }

        return targets;
    }

    public refresh() {
        MumbleClearVoiceTarget(VOICE_TARGET);

        for (const [playerId] of this.players) {
            MumbleAddVoiceTargetPlayerByServerId(VOICE_TARGET, playerId);
        }
    }

    public addPlayer(playerId: number, audioContextType: AudioContextType) {
        if (!this.players.has(playerId)) {
            MumbleAddVoiceTargetPlayerByServerId(VOICE_TARGET, playerId);

            this.players.set(playerId, []);
        }

        const player = this.players.get(playerId);
        player.push(audioContextType);
    }

    public removePlayer(playerId: number, audioContextType: AudioContextType) {
        if (!this.players.has(playerId)) {
            return;
        }

        const player = this.players.get(playerId);
        const index = player.indexOf(audioContextType);

        if (index === -1) {
            return;
        }

        player.splice(index, 1);

        if (player.length === 0) {
            MumbleRemoveVoiceTargetPlayerByServerId(VOICE_TARGET, playerId);

            this.players.delete(playerId);
        }
    }
}
