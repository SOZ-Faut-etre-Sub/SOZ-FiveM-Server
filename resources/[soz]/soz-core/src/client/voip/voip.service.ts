import { emitRpc } from '@core/rpc';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { VoiceRadioProvider } from '@public/client/voip/voice/voice.radio.provider';
import { Inject, Injectable } from '@public/core/decorators/injectable';
import { wait } from '@public/core/utils';
import { ServerEvent } from '@public/shared/event';
import { VoiceMode } from '@public/shared/hud';
import { RpcServerEvent } from '@public/shared/rpc';
import { RadioChannelType, RadioType } from '@public/shared/voip';

const WHISPER_RANGE = 2.0;
const NORMAL_RANGE = 4.5;
const SHOUT_RANGE = 8.0;
const MEGAPHONE_RANGE = 38.0;
const MICROPHONE_RANGE = 70.0;

type VoiceModeRange = VoiceMode.Shouting | VoiceMode.Normal | VoiceMode.Whisper;

@Injectable()
export class VoipService {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(VoiceRadioProvider)
    private readonly voiceRadioProvider: VoiceRadioProvider;

    private channels = new Map<number, number>();

    private voiceModeRange: VoiceModeRange = VoiceMode.Normal;

    private isMicrophoneInUse = false;

    private isMegaphoneInUse = false;

    private overrideInputRange: number | null = null;

    private isMuted = false;

    private ready = false;

    private radioJammed = false;

    public getVoiceClickVolume(radioType: RadioType, channelType: RadioChannelType) {
        return this.voiceRadioProvider.getVoiceClickVolume(radioType, channelType);
    }

    public setVoiceClickVolume(radioType: RadioType, channelType: RadioChannelType, value: number) {
        SetResourceKvp(`radio_volume_${radioType}_${channelType}`, value.toString());
    }

    public setVoiceModeRange(mode: VoiceModeRange) {
        this.voiceModeRange = mode;

        this.updateRange();
    }

    public getVoiceMode(): VoiceMode {
        if (this.isMuted) {
            return VoiceMode.Mute;
        }

        if (this.isMegaphoneInUse) {
            return VoiceMode.Megaphone;
        }

        if (this.isMicrophoneInUse) {
            return VoiceMode.Microphone;
        }

        return this.voiceModeRange;
    }

    public getOverrideInputRange() {
        return this.overrideInputRange;
    }

    public resetVoiceMode() {
        this.isMuted = false;
        this.isMicrophoneInUse = false;
        this.isMicrophoneInUse = false;
        this.voiceModeRange = VoiceMode.Normal;
        this.overrideInputRange = null;

        this.updateRange();
    }

    public async mutePlayer(value: boolean) {
        while (!this.ready) {
            await wait(100);
        }

        const isOk = await emitRpc<boolean>(RpcServerEvent.VOIP_SET_MUTE, GetPlayerServerId(PlayerId()), value);

        if (!isOk) {
            return;
        }

        this.isMuted = value;

        this.updateRange();
    }

    public isPlayerMuted() {
        return this.isMuted;
    }

    public setPlayerMegaphoneInUse(value: boolean, range: number = MEGAPHONE_RANGE) {
        TriggerServerEvent(ServerEvent.VOIP_SET_MEGAPHONE, value);

        this.overrideInputRange = value ? range : null;
        this.isMegaphoneInUse = value;

        this.updateRange();
    }

    public setPlayerMicrophoneInUse(value: boolean) {
        this.overrideInputRange = value ? MICROPHONE_RANGE : null;
        this.isMicrophoneInUse = value;

        this.updateRange();
    }

    public disconnectRadio(frequency: number) {
        if (!this.channels.has(frequency)) {
            return;
        }

        this.channels.set(frequency, this.channels.get(frequency) - 1);

        if (this.channels.get(frequency) <= 0) {
            this.channels.delete(frequency);
            this.voiceRadioProvider.stopTransmitting(frequency);
            this.voiceRadioProvider.removeListenersOnFrequency(frequency);

            TriggerServerEvent(ServerEvent.VOIP_RADIO_LEAVE_CHANNEL, frequency);
        }
    }

    public connectRadio(frequency: number) {
        if (!this.channels.has(frequency)) {
            this.channels.set(frequency, 0);
            TriggerServerEvent(ServerEvent.VOIP_RADIO_JOIN_CHANNEL, frequency);
        }

        this.channels.set(frequency, this.channels.get(frequency) + 1);
    }

    public updateRange() {
        const voiceMode = this.getVoiceMode();
        this.nuiDispatch.dispatch('hud', 'UpdateVoiceMode', voiceMode);

        if (voiceMode === VoiceMode.Normal) {
            MumbleSetTalkerProximity(NORMAL_RANGE);
        } else if (voiceMode === VoiceMode.Whisper) {
            MumbleSetTalkerProximity(WHISPER_RANGE);
        } else if (voiceMode === VoiceMode.Shouting) {
            MumbleSetTalkerProximity(SHOUT_RANGE);
        } else if (voiceMode === VoiceMode.Megaphone) {
            MumbleSetTalkerProximity(MEGAPHONE_RANGE);
        } else if (voiceMode === VoiceMode.Microphone) {
            MumbleSetTalkerProximity(MICROPHONE_RANGE);
        }

        if (this.overrideInputRange !== null) {
            MumbleSetTalkerProximity(this.overrideInputRange);
        }
    }

    public isReady(): boolean {
        return this.ready;
    }

    public setReady(value: boolean) {
        this.ready = value;
    }

    public setRadioJammed(value: boolean) {
        if (value == this.radioJammed) {
            return;
        }
        this.radioJammed = value;
        for (const frequency of this.voiceRadioProvider.frequencyTransmission.keys()) {
            if (value) {
                this.disconnectRadio(frequency);
            } else {
                this.connectRadio(frequency);
            }
        }
        this.voiceRadioProvider.setJammed(this.radioJammed);
    }
}
