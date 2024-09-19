import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { VoiceMode } from '../../../shared/hud';
import { useNuiEvent } from '../../hook/nui';
import { RootState } from '../../store';
import { GlassMorphismBox } from '../Styleguide/GlassMorphismContainer';
import { Compass } from './components/Compass';
import { DateTime } from './components/DateTime';
import { Location } from './components/Location';
import { PlayerStats } from './components/PlayerStats';
import { VoiceIcon } from './components/VoiceIcon';
import { Weather } from './components/Weather';
import { useDaltonism } from './hooks/useDaltonism';

export const WatchInterface: FunctionComponent = () => {
    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const minimap = useSelector((state: RootState) => state.hud.minimap);

    const [voiceMode, setVoiceMode] = useState(VoiceMode.Normal);
    const [voiceActive, setVoiceActive] = useState(true);

    const { imagePrefix } = useDaltonism();

    useNuiEvent('hud', 'UpdateVoiceMode', setVoiceMode);
    useNuiEvent('hud', 'UpdateVoiceActive', setVoiceActive);

    const [voiceIcon, disableAutoHide] = useMemo(() => {
        if (!voiceActive) {
            return [`${imagePrefix}disconnected`, true];
        }

        switch (voiceMode) {
            case VoiceMode.Mute:
                return ['mute', true];
            case VoiceMode.Whisper:
                return ['whisper', false];
            case VoiceMode.Normal:
                return ['normal', false];
            case VoiceMode.Shouting:
                return ['shouting', false];
            case VoiceMode.Microphone:
                return ['microphone', false];
            case VoiceMode.Megaphone:
                return ['megaphone', false];
        }
    }, [voiceActive, voiceMode]);

    const headerStyles = useSpring({
        from: {
            bottom: '-100vh',
        },
        to: {
            width: `${minimap.width * 100}vw`,
            bottom: `${100 - (minimap.top + 0.005) * 100}vh`,
            left: `${(minimap.left + 0.005) * 100}vw`,
        },
    });

    const footerStyles = useSpring({
        from: {
            bottom: '150vh',
        },
        to: {
            top: `${(minimap.bottom + 0.005) * 100}vh`,
            left: `${(minimap.left + 0.005) * 100}vw`,
        },
    });

    const voiceStyles = useSpring({
        from: {
            bottom: '-50vh',
        },
        to: {
            bottom: `${100 - minimap.bottom * 100}vh`,
            left: `${(minimap.right + 0.005) * 100}vw`,
        },
    });

    return (
        <>
            <animated.div
                className={cn('absolute flex justify-between items-end text-white -z-10', {
                    'px-5': minimap.isHidden,
                })}
                style={headerStyles}
            >
                <DateTime />
                <Weather />
            </animated.div>

            {hasWatch && !minimap.isHidden && (
                <GlassMorphismBox
                    className="rounded-lg"
                    style={{
                        top: `${(minimap.top + 0.0105) * 100}vh`,
                        height: `${(minimap.height - 0.015) * 100}vh`,
                        left: `${(minimap.left + 0.0045) * 100}vw`,
                        width: `${minimap.width * 100}vw`,
                    }}
                />
            )}

            <animated.div className="absolute size-12 drop-shadow-bg ml-3" style={voiceStyles}>
                <VoiceIcon icon={voiceIcon} disableAutoHide={disableAutoHide} />
            </animated.div>

            <animated.div className="absolute flex gap-3 text-white h-fit" style={footerStyles}>
                <Location />
                <Compass />
                <PlayerStats />
            </animated.div>
        </>
    );
};
