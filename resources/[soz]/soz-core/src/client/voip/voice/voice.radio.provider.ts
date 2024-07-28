import { PlayerService } from '@public/client/player/player.service';
import { Provider } from '@public/core/decorators/provider';
import { Control } from '@public/shared/input';

import { Command } from '../../../core/decorators/command';
import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Tick } from '../../../core/decorators/tick';
import { emitRpc } from '../../../core/rpc';
import { wait } from '../../../core/utils';
import { ClientEvent } from '../../../shared/event/client';
import { Vector3 } from '../../../shared/polyzone/vector';
import { RpcServerEvent } from '../../../shared/rpc';
import { AudioContextRadio, Ear, RadioChannelType, RadioType } from '../../../shared/voip';
import { AnimationRunner } from '../../animation/animation.factory';
import { AnimationService } from '../../animation/animation.service';
import { SoundService } from '../../sound.service';
import { Store } from '../../store/store';
import { VoiceListeningService } from './voice.listening.service';
import { VoiceTargetService } from './voice.target.service';

@Provider()
export class VoiceRadioProvider {
    @Inject(VoiceTargetService)
    private voiceTargetService: VoiceTargetService;

    @Inject(VoiceListeningService)
    private voiceListeningService: VoiceListeningService;

    @Inject(SoundService)
    private soundService: SoundService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject('Store')
    private store: Store;

    public transmittingAnimation: AnimationRunner = null;
    private jammed = false;
    public frequencyTransmission = new Map<number, () => void>();

    @Command('radio_lr_primary', {
        description: 'Parler en radio immobile (primaire)',
        toggle: true,
        passthroughNuiFocus: true,
        passthroughPauseMenu: true,
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async startTransmittingLongRangePrimary(_source: number, active: boolean) {
        const radioLongRange = this.store.getState().radioLongRange;

        if (!radioLongRange.enabled) {
            return;
        }

        const frequency = radioLongRange.primary.frequency;

        if (!frequency) {
            return;
        }

        if (active) {
            this.startTransmitting(frequency, RadioType.RadioLongRange, RadioChannelType.Primary);
        } else {
            this.stopTransmitting(frequency);
        }
    }

    @Command('radio_lr_secondary', {
        description: 'Parler en radio immobile (secondaire)',
        toggle: true,
        passthroughNuiFocus: true,
        passthroughPauseMenu: true,
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async startTransmittingLongRangeSecondary(_source: number, active: boolean) {
        const radioLongRange = this.store.getState().radioLongRange;

        if (!radioLongRange.enabled) {
            return;
        }

        const frequency = radioLongRange.secondary.frequency;

        if (!frequency) {
            return;
        }

        if (active) {
            this.startTransmitting(frequency, RadioType.RadioLongRange, RadioChannelType.Secondary);
        } else {
            this.stopTransmitting(frequency);
        }
    }

    @Command('radio_sr_primary', {
        description: 'Parler en radio mobile (primaire)',
        toggle: true,
        passthroughNuiFocus: true,
        passthroughPauseMenu: true,
        keys: [
            {
                mapper: 'keyboard',
                key: 'SEMICOLON',
            },
        ],
    })
    public async startTransmittingShortRangePrimary(_source: number, active: boolean) {
        const radioShortRange = this.store.getState().radioShortRange;

        if (!radioShortRange.enabled) {
            return;
        }

        const frequency = radioShortRange.primary.frequency;

        if (!frequency) {
            return;
        }

        if (active) {
            this.startTransmitting(frequency, RadioType.RadioShortRange, RadioChannelType.Primary);
        } else {
            this.stopTransmitting(frequency);
        }
    }

    @Command('radio_sr_secondary', {
        description: 'Parler en radio mobile (secondaire)',
        toggle: true,
        passthroughNuiFocus: true,
        passthroughPauseMenu: true,
        keys: [
            {
                mapper: 'keyboard',
                key: 'COMMA',
            },
        ],
    })
    public async startTransmittingShortRangeSecondary(_source: number, active: boolean) {
        const radioShortRange = this.store.getState().radioShortRange;

        if (!radioShortRange.enabled) {
            return;
        }

        const frequency = radioShortRange.secondary.frequency;

        if (!frequency) {
            return;
        }

        if (active) {
            this.startTransmitting(frequency, RadioType.RadioShortRange, RadioChannelType.Secondary);
        } else {
            this.stopTransmitting(frequency);
        }
    }

    public async startTransmitting(frequency: number, radioType: RadioType, channelType: RadioChannelType) {
        if (this.frequencyTransmission.has(frequency)) {
            return;
        }

        const player = this.playerService.getState();

        if (!player) {
            return;
        }

        if (player.isDead || player.isInHub || player.carryBox) {
            return;
        }

        if (this.jammed) {
            this.soundService.play('radio/jammed', 1.0);
            this.transmittingAnimation = this.animationService.playAnimation({
                base: {
                    dictionary: 'random@arrests',
                    name: 'generic_radio_chatter',
                    options: {
                        onlyUpperBody: true,
                        enablePlayerControl: true,
                    },
                    duration: 500,
                },
            });

            return;
        }

        let isTransmitting = true;

        this.frequencyTransmission.set(frequency, () => {
            isTransmitting = false;
        });

        const selfPlayerId = GetPlayerServerId(PlayerId());
        const clickVolume = this.getVoiceClickVolume(radioType, channelType) / 100;
        const position = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const players = await emitRpc<number[]>(
            RpcServerEvent.VOIP_VOICE_START_TRANSMITTING,
            frequency,
            radioType,
            channelType,
            position
        );

        for (const player of players) {
            if (player === selfPlayerId) {
                continue;
            }

            this.voiceTargetService.addPlayer(player, 'radio');
        }

        this.soundService.play(radioType + '/mic_click_on', clickVolume);

        while (isTransmitting && !this.jammed) {
            SetControlNormal(0, Control.PushToTalk, 1.0);

            await wait(0);
        }

        for (const player of players) {
            if (player === selfPlayerId) {
                continue;
            }

            this.voiceTargetService.removePlayer(player, 'radio');
        }

        await emitRpc(RpcServerEvent.VOIP_VOICE_STOP_TRANSMITTING, frequency);

        if (this.jammed) {
            this.soundService.play('radio/jammed', 1.0);
        } else {
            this.soundService.play(radioType + '/mic_click_off', clickVolume);
        }
        this.frequencyTransmission.delete(frequency);
    }

    public stopTransmitting(frequency: number) {
        if (!this.frequencyTransmission.has(frequency)) {
            return;
        }

        const canceller = this.frequencyTransmission.get(frequency);
        canceller();
    }

    @OnEvent(ClientEvent.VOIP_VOICE_RADIO_PLAYER_START_TRANSMITTING)
    public onPlayerStartTransmitting(
        player: number,
        frequency: number,
        radioType: RadioType,
        channelType: RadioChannelType,
        position: Vector3
    ) {
        // get info about the radio frequency
        const radioInfo = this.getRadioInfoFromFrequency(frequency);

        if (!radioInfo.radioType) {
            return;
        }

        this.voiceListeningService.addPlayerAudioContext(player, 'radio', {
            type: 'radio',
            priority: 2,
            frequency,
            position,
            radioType: radioType,
            ear: radioInfo.ear,
            volume: radioInfo.volume,
        });

        const clickVolume = 0.8 * this.getVoiceClickVolume(radioType, channelType);
        this.soundService.play(radioType + '/mic_click_on', clickVolume / 100);
    }

    @OnEvent(ClientEvent.VOIP_VOICE_RADIO_PLAYER_STOP_TRANSMITTING)
    public onPlayerStopTransmitting(player: number, frequency: number) {
        this.voiceListeningService.removePlayerAudioContext(player, 'radio');

        const radioInfo = this.getRadioInfoFromFrequency(frequency);

        if (!radioInfo.radioType) {
            return;
        }

        const clickVolume = this.getVoiceClickVolume(radioInfo.radioType, radioInfo.channelType);
        this.soundService.play(radioInfo.radioType + '/mic_click_off', clickVolume / 100);
    }

    public removeListenersOnFrequency(frequency: number) {
        for (const player of this.voiceListeningService.getListeners()) {
            const audioContext = player.contexts.radio as AudioContextRadio;

            if (!audioContext) {
                continue;
            }

            if (audioContext.frequency !== frequency) {
                continue;
            }

            this.voiceListeningService.removePlayerAudioContext(player.serverId, 'radio');
        }
    }

    @Tick()
    public checkTransmittingAnimation() {
        if (this.frequencyTransmission.size === 0) {
            if (this.transmittingAnimation) {
                this.transmittingAnimation.cancel();
                this.transmittingAnimation = null;
            }

            return;
        }

        if (!this.transmittingAnimation || !this.transmittingAnimation.running) {
            this.transmittingAnimation = this.animationService.playAnimation({
                base: {
                    dictionary: 'random@arrests',
                    name: 'generic_radio_chatter',
                    options: {
                        repeat: true,
                        onlyUpperBody: true,
                        enablePlayerControl: true,
                    },
                },
            });
        }
    }

    private getRadioInfoFromFrequency(frequency: number) {
        const radioShortRange = this.store.getState().radioShortRange;
        const radioLongRange = this.store.getState().radioLongRange;

        let ear: Ear = null;
        let volume: number = null;
        let radioType: RadioType = null;
        let channelType: RadioChannelType = null;

        if (radioShortRange.enabled) {
            if (radioShortRange.primary.frequency === frequency) {
                ear = radioShortRange.primary.ear;
                volume = radioShortRange.primary.volume;
                radioType = RadioType.RadioShortRange;
                channelType = RadioChannelType.Primary;
            } else if (radioShortRange.secondary.frequency === frequency) {
                ear = radioShortRange.secondary.ear;
                volume = radioShortRange.secondary.volume;
                radioType = RadioType.RadioShortRange;
                channelType = RadioChannelType.Secondary;
            }
        }

        if (radioLongRange.enabled) {
            if (radioLongRange.primary.frequency === frequency) {
                ear = radioLongRange.primary.ear;
                volume = radioLongRange.primary.volume;
                radioType = RadioType.RadioLongRange;
                channelType = RadioChannelType.Primary;
            } else if (radioLongRange.secondary.frequency === frequency) {
                ear = radioLongRange.secondary.ear;
                volume = radioLongRange.secondary.volume;
                radioType = RadioType.RadioLongRange;
                channelType = RadioChannelType.Secondary;
            }
        }

        return { ear, volume, radioType, channelType };
    }

    @OnEvent(ClientEvent.PLAYER_ON_DEATH, false)
    public onDead() {
        for (const frequency of this.frequencyTransmission.keys()) {
            this.stopTransmitting(frequency);
        }
    }

    public getVoiceClickVolume(radioType: RadioType, channelType: RadioChannelType) {
        const valueString = GetResourceKvpString(`radio_volume_${radioType}_${channelType}`);

        if (valueString === null) {
            return 50;
        }

        return parseInt(valueString);
    }

    public setJammed(value: boolean) {
        this.jammed = value;
    }
}
