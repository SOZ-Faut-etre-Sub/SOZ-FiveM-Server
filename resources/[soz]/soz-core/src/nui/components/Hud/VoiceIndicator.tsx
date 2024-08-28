import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent, useEffect, useState } from 'react';

import { VoiceMode } from '../../../shared/hud';
import { useHud } from '../../hook/data';
import { useNuiEvent } from '../../hook/nui';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';

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

    if (!voiceActive) {
        return (
            <animated.div className="absolute h-11 w-11" style={styles}>
                <VoiceIcon icon="disconnected" disableAutoHide />
            </animated.div>
        );
    }

    return (
        <animated.div className="absolute h-11 w-11" style={styles}>
            {voiceMode === VoiceMode.Mute && <VoiceIcon icon="mute" disableAutoHide />}
            {voiceMode === VoiceMode.Whisper && <VoiceIcon icon="whisper" />}
            {voiceMode === VoiceMode.Normal && <VoiceIcon icon="normal" />}
            {voiceMode === VoiceMode.Shouting && <VoiceIcon icon="shouting" />}
            {voiceMode === VoiceMode.Microphone && <VoiceIcon icon="microphone" />}
            {voiceMode === VoiceMode.Megaphone && <VoiceIcon icon="megaphone" />}
        </animated.div>
    );
};

const VoiceIcon: FunctionComponent<{ icon: string; disableAutoHide?: boolean }> = ({ icon, disableAutoHide }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (disableAutoHide) return;

        const timeout = setTimeout(() => {
            setShow(false);
        }, 3000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    const styles = useSpring({
        from: {
            opacity: '0',
        },
        to: {
            opacity: show ? '1' : '0',
        },
    });

    return (
        <animated.div style={styles}>
            <GlassMorphismContainer className="flex justify-center items-center h-11 w-11">
                <img className="size-10" src={`/public/images/hud/voice/${icon}.webp`} alt={icon} />
            </GlassMorphismContainer>
        </animated.div>
    );
};
