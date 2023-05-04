import { FunctionComponent, useState } from 'react';

import { VoiceMode } from '../../../shared/hud';
import { useNuiEvent } from '../../hook/nui';
import MegaphoneIcon from '../../icons/hud/voice/megaphone.svg';
import MicrophoneIcon from '../../icons/hud/voice/microphone.svg';
import MuteIcon from '../../icons/hud/voice/mute.svg';
import NormalIcon from '../../icons/hud/voice/normal.svg';
import ShoutingIcon from '../../icons/hud/voice/shouting.svg';
import WhisperIcon from '../../icons/hud/voice/whisper.svg';

export const VoiceIndicator: FunctionComponent = () => {
    const [voiceMode, setVoiceMode] = useState(VoiceMode.Normal);

    useNuiEvent('hud', 'UpdateVoiceMode', setVoiceMode);

    return (
        <div className="fixed right-[13vw] bottom-[1.5rem] text-white/75">
            {voiceMode === VoiceMode.Mute && <MuteIcon className="w-12 h-12 animate-display-persist opacity-100" />}
            {voiceMode === VoiceMode.Whisper && <WhisperIcon className="w-12 h-12 animate-display-in opacity-0" />}
            {voiceMode === VoiceMode.Normal && <NormalIcon className="w-12 h-12 animate-display-in opacity-0" />}
            {voiceMode === VoiceMode.Shouting && <ShoutingIcon className="w-12 h-12 animate-display-in opacity-0" />}
            {voiceMode === VoiceMode.Megaphone && <MegaphoneIcon className="w-12 h-12 animate-display-in opacity-0" />}
            {voiceMode === VoiceMode.Microphone && (
                <MicrophoneIcon className="w-12 h-12 animate-display-in opacity-0" />
            )}
        </div>
    );
};
