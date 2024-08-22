import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent, useState } from 'react';

import { VoiceMode } from '../../../shared/hud';
import { useHud } from '../../hook/data';
import { useNuiEvent } from '../../hook/nui';
import MegaphoneIcon from '../../icons/hud/voice/megaphone.svg';
import MicrophoneIcon from '../../icons/hud/voice/microphone.svg';
import MuteIcon from '../../icons/hud/voice/mute.svg';
import NormalIcon from '../../icons/hud/voice/normal.svg';
import ShoutingIcon from '../../icons/hud/voice/shouting.svg';
import WhisperIcon from '../../icons/hud/voice/whisper.svg';

export const VoiceIndicator: FunctionComponent = () => {
    const { minimap } = useHud();

    const [voiceMode, setVoiceMode] = useState(VoiceMode.Normal);
    const [voiceActive, setVoiceActive] = useState(true);

    const styles = useSpring({
        from: {
            bottom: '-100vh',
        },
        to: {
            bottom: `${100 - (minimap.top + minimap.height) * 100}vh`,
            left: `${(minimap.right + 0.015) * 100}vw`,
        },
    });

    useNuiEvent('hud', 'UpdateVoiceMode', setVoiceMode);
    useNuiEvent('hud', 'UpdateVoiceActive', setVoiceActive);

    const aspectRatio = window.innerWidth / window.innerHeight;
    let iconSize = 'w-[4vh] h-[4vh]';
    if (aspectRatio > 3.5 && window.innerWidth > 5000) {
        iconSize = 'w-[3vh] h-[3vh]';
    } else if (aspectRatio < 2 && window.innerHeight > 1080) {
        iconSize = 'w-[3vh] h-[3vh]';
    }
    const dropShadow = 'drop-shadow-[2px_2px_2px_rgba(0,0,7,0.7)]';

    return (
        <animated.div className="absolute text-white/75" style={styles}>
            {!voiceActive && (
                <div
                    className="text-xl text-red-700 font-bold"
                    style={{
                        textShadow: '2px 2px 2px rgba(0,0,7,0.7)',
                    }}
                >
                    VOIP déconnecté
                </div>
            )}
            {voiceMode === VoiceMode.Mute && (
                <MuteIcon className={`${iconSize} animate-display-persist opacity-100 ${dropShadow}`} />
            )}
            {voiceMode === VoiceMode.Whisper && (
                <WhisperIcon className={`${iconSize} animate-display-in opacity-0 ${dropShadow}`} />
            )}
            {voiceMode === VoiceMode.Normal && (
                <NormalIcon className={`${iconSize} animate-display-in opacity-0 ${dropShadow}`} />
            )}
            {voiceMode === VoiceMode.Shouting && (
                <ShoutingIcon className={`${iconSize} animate-display-in opacity-0 ${dropShadow}`} />
            )}
            {voiceMode === VoiceMode.Megaphone && (
                <MegaphoneIcon className={`${iconSize} animate-display-in opacity-0 ${dropShadow}`} />
            )}
            {voiceMode === VoiceMode.Microphone && (
                <MicrophoneIcon className={`${iconSize} animate-display-in opacity-0 ${dropShadow}`} />
            )}
        </animated.div>
    );
};
