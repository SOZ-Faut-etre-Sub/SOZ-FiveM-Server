import { Injectable } from '@public/core/decorators/injectable';
import { ServerEvent } from '@public/shared/event';
import { Ear, RadioChannelType, RadioType } from '@public/shared/voip';

@Injectable()
export class VoipService {
    public mutePlayer(value: boolean) {
        exports['soz-voip'].MutePlayer(value);
    }

    public setPlayerMegaphoneInUse(value: boolean, range: number | null = null) {
        exports['soz-voip'].SetPlayerMegaphoneInUse(value, range);
        TriggerServerEvent(ServerEvent.VOIP_SET_MEGAPHONE, value);
    }

    public setPlayerMicrophoneInUse(value: boolean) {
        exports['soz-voip'].SetPlayerMicrophoneInUse(value);
    }

    public disconnectRadio(type: RadioType, channelType: RadioChannelType, frequency: number) {
        TriggerServerEvent('voip:server:radio:disconnect', type, frequency, channelType);
    }

    public connectRadio(type: RadioType, channelType: RadioChannelType, frequency: number) {
        TriggerServerEvent('voip:server:radio:connect', type, channelType, frequency);
    }

    public setRadioEar(type: RadioType, channelType: RadioChannelType, ear: Ear) {
        TriggerEvent('voip:client:radio:set-balance', type, channelType, ear);
    }

    public setRadioVolume(type: RadioType, channelType: RadioChannelType, volume: number) {
        if (type === RadioType.RadioShortRange && channelType === RadioChannelType.Primary) {
            exports['soz-voip'].SetRadioShortRangePrimaryVolume(volume);
        }

        if (type === RadioType.RadioShortRange && channelType === RadioChannelType.Secondary) {
            exports['soz-voip'].SetRadioShortRangeSecondaryVolume(volume);
        }

        if (type === RadioType.RadioLongRange && channelType === RadioChannelType.Primary) {
            exports['soz-voip'].SetRadioLongRangePrimaryVolume(volume);
        }

        if (type === RadioType.RadioLongRange && channelType === RadioChannelType.Secondary) {
            exports['soz-voip'].SetRadioLongRangeSecondaryVolume(volume);
        }
    }
}
