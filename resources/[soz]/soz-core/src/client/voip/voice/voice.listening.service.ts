import { Inject, Injectable } from '../../../core/decorators/injectable';
import { Logger } from '../../../core/logger';
import { getDistance, Vector3 } from '../../../shared/polyzone/vector';
import { AudioContext, AudioContextRadio, AudioContextType, Ear, PlayerVoice, RadioType } from '../../../shared/voip';

/**
 * Service that handles the listening of the voice
 *
 * This handle of the voice of the player should be modulled
 * Which effects to apply, and which volume to use (proximity -1, or forced one for phone / radio / car / etc ...)
 */
const VOLUME_CAR_OVERRIDE = 0.5;
const VOLUME_PHONE_OVERRIDE = 0.8;

enum SubmixType {
    PHONE = 'phone',
    MEGAPHONE = 'megaphone',
    RADIO = 'radio',
}

type SubmixConfiguration = {
    intParams: Record<string, number>;
    floatParams: Record<string, number>;
};

const SUBMIXES: Record<SubmixType, SubmixConfiguration> = {
    [SubmixType.PHONE]: {
        intParams: {
            default: 1,
            enabled: 1,
        },
        floatParams: {
            freq_low: 100.0,
            freq_hi: 6000.0,
            fudge: 0.0,
        },
    },
    [SubmixType.MEGAPHONE]: {
        intParams: {
            default: 1,
            enabled: 1,
        },
        floatParams: {
            freq_low: 200.0,
            freq_hi: 4000.0,
            fudge: 2.0,
        },
    },
    [SubmixType.RADIO]: {
        intParams: {
            default: 1,
            enabled: 1,
        },
        floatParams: {
            freq_low: 100.0,
            freq_hi: 6000.0,
            fudge: 0.0,
        },
    },
};

const SHORT_RANGE_DISTANCE = 1000.0;

const MAX_SUBMIXES = 8;

@Injectable()
export class VoiceListeningService {
    @Inject(Logger)
    private logger: Logger;

    private players: Map<number, PlayerVoice> = new Map();

    private availableSubmixes = new Set<number>();

    private usedSubmixes = new Map<number, number>();

    public getListeners(): PlayerVoice[] {
        return [...this.players.values()];
    }

    public getSubmixes(): [number, number][] {
        return [...this.usedSubmixes.entries()];
    }

    public addPlayerAudioContext(playerId: number, audioContextType: AudioContextType, audioContext: AudioContext) {
        let player = this.players.get(playerId);

        if (!player) {
            player = {
                serverId: playerId,
                contexts: {},
            };

            this.players.set(playerId, player);
        }

        if (player.contexts[audioContextType]) {
            return;
        }

        player.contexts[audioContextType] = audioContext;

        this.handlePlayerVoice(player);
    }

    public removePlayerAudioContext(playerId: number, audioContextType: AudioContextType) {
        const player = this.players.get(playerId);

        if (!player) {
            return;
        }

        if (!player.contexts[audioContextType]) {
            return;
        }

        delete player.contexts[audioContextType];

        if (Object.keys(player.contexts).length === 0) {
            this.players.delete(playerId);
        }

        this.handlePlayerVoice(player);
    }

    private handlePlayerVoice(player: PlayerVoice) {
        if (player.contexts.phone || player.contexts.phone_speaker) {
            return this.handlePlayerVoicePhone(player);
        }

        if (player.contexts.radio) {
            return this.handlePlayerVoiceRadio(player, player.contexts.radio as AudioContextRadio);
        }

        if (player.contexts.car) {
            return this.handlePlayerVoiceCar(player);
        }

        if (player.contexts.megaphone) {
            return this.handlePlayerVoiceMegaphone(player);
        }

        if (player.contexts.eodrobot) {
            return this.handlePlayerVoiceEodRobot(player);
        }

        if (player.contexts.proximity) {
            return this.handlePlayerVoiceProximity(player);
        }

        // Reset potential volume override
        MumbleSetVolumeOverrideByServerId(player.serverId, -1.0);
        this.removeSubmix(player.serverId);
    }

    private handlePlayerVoicePhone(player: PlayerVoice) {
        // Don't use proximity
        MumbleSetVolumeOverrideByServerId(player.serverId, VOLUME_PHONE_OVERRIDE);

        // Apply filter
        this.setSubmix(player.serverId, SubmixType.PHONE);
    }

    private handlePlayerVoiceRadio(player: PlayerVoice, context: AudioContextRadio) {
        // Don't use proximity
        MumbleSetVolumeOverrideByServerId(player.serverId, (0.8 * context.volume) / 100);

        // Apply filter
        this.setSubmix(player.serverId, SubmixType.RADIO, context);
    }

    private handlePlayerVoiceCar(player: PlayerVoice) {
        // Don't use proximity
        MumbleSetVolumeOverrideByServerId(player.serverId, VOLUME_CAR_OVERRIDE);

        // Remove filter if any
        this.removeSubmix(player.serverId);
    }

    private handlePlayerVoiceMegaphone(player: PlayerVoice) {
        // Use default proximity
        MumbleSetVolumeOverrideByServerId(player.serverId, -1.0);

        // Apply filter
        this.setSubmix(player.serverId, SubmixType.MEGAPHONE);
    }

    private handlePlayerVoiceEodRobot(player: PlayerVoice) {
        // Use default proximity
        MumbleSetVolumeOverrideByServerId(player.serverId, -1.0);

        // Apply filter
        this.setSubmix(player.serverId, SubmixType.RADIO);
    }

    private handlePlayerVoiceProximity(player: PlayerVoice) {
        // Use default proximity
        MumbleSetVolumeOverrideByServerId(player.serverId, -1.0);

        // Remove filter if any
        this.removeSubmix(player.serverId);
    }

    public createAudioSubmixes() {
        for (let i = 0; i < MAX_SUBMIXES; i++) {
            const submixName = `submix_${i}`;
            const submixId = CreateAudioSubmix(submixName);

            if (submixId === -1) {
                this.logger.error(`Failed to create submix ${submixName}`);

                continue;
            }

            AddAudioSubmixOutput(submixId, 1);
            this.availableSubmixes.add(submixId);
        }
    }

    private setSubmix(serverId: number, submixType: SubmixType, radioContext: AudioContextRadio | null = null) {
        const submixConfiguration = SUBMIXES[submixType];

        if (!submixConfiguration) {
            this.logger.error(`Submix configuration ${submixType} not found`);
            MumbleSetSubmixForServerId(serverId, -1);

            return;
        }

        let submixId = this.usedSubmixes.get(serverId);

        if (!submixId) {
            if (this.availableSubmixes.size === 0) {
                MumbleSetSubmixForServerId(serverId, -1);
                this.logger.error(`No submix available for ${serverId}`);

                return;
            }

            submixId = this.availableSubmixes.values().next().value;
            this.availableSubmixes.delete(submixId);
        }

        this.usedSubmixes.set(serverId, submixId);
        MumbleSetSubmixForServerId(serverId, submixId);

        // Set radio effect
        SetAudioSubmixEffectRadioFx(submixId, 1);

        if (submixConfiguration) {
            for (const [key, value] of Object.entries(submixConfiguration.intParams)) {
                SetAudioSubmixEffectParamInt(submixId, 1, GetHashKey(key), value);
            }

            for (const [key, value] of Object.entries(submixConfiguration.floatParams)) {
                SetAudioSubmixEffectParamFloat(submixId, 1, GetHashKey(key), value);
            }
        }

        if (submixType === SubmixType.RADIO && radioContext) {
            const currentPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
            const speakerPosition = radioContext.position;
            const distance = getDistance(currentPosition, speakerPosition);
            let volume = radioContext.volume;

            if (distance > SHORT_RANGE_DISTANCE && radioContext.radioType === RadioType.RadioShortRange) {
                const distanceRatio = distance / SHORT_RANGE_DISTANCE;
                const fudge = 6.0 + distanceRatio * 4.0;
                volume = volume * 0.8 * (1.0 / (distanceRatio * 15.0));

                SetAudioSubmixEffectParamFloat(submixId, 1, GetHashKey('fudge'), fudge);
            } else {
                SetAudioSubmixEffectParamFloat(submixId, 1, GetHashKey('fudge'), 6.0);
            }

            const leftVolume = radioContext.ear === Ear.Both || radioContext.ear === Ear.Left ? volume : 0.0;
            const rightVolume = radioContext.ear === Ear.Both || radioContext.ear === Ear.Right ? volume : 0.0;

            SetAudioSubmixOutputVolumes(
                submixId,
                0,
                leftVolume,
                rightVolume,
                leftVolume,
                rightVolume,
                leftVolume,
                rightVolume
            );
        } else {
            // Reset balance and fudge if not radio
            SetAudioSubmixEffectParamFloat(submixId, 1, GetHashKey('fudge'), 0.0);
            SetAudioSubmixOutputVolumes(submixId, 0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
        }
    }

    private removeSubmix(serverId: number) {
        MumbleSetSubmixForServerId(serverId, -1);

        if (!this.usedSubmixes.has(serverId)) {
            return;
        }

        const submixId = this.usedSubmixes.get(serverId);

        this.usedSubmixes.delete(serverId);
        this.availableSubmixes.add(submixId);
    }
}
