import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent, useMemo, useState } from 'react';

import { VoiceMode } from '../../../shared/hud';
import { useAmmo, useMinimap } from '../../hook/data';
import { useNuiEvent } from '../../hook/nui';
import { VoiceIcon } from './components/VoiceIcon';

export const WeaponAndVoipInterface: FunctionComponent = () => {
    const minimap = useMinimap();
    const ammo = useAmmo();

    const [voiceMode, setVoiceMode] = useState(VoiceMode.Normal);
    const [voiceActive, setVoiceActive] = useState(true);

    useNuiEvent('hud', 'UpdateVoiceMode', setVoiceMode);
    useNuiEvent('hud', 'UpdateVoiceActive', setVoiceActive);

    const [ammoStyles] = useSpring(
        () => ({
            from: {
                top: '150vh',
            },
            to: {
                top: ammo.hasWeapon ? `${(minimap.bottom + 0.005) * 100}vh` : '150vh',
                right: `${(minimap.left + 0.005) * 100}vw`,
            },
        }),
        [ammo, minimap]
    );

    const [voiceStyles] = useSpring(
        () => ({
            from: {
                top: '150vh',
            },
            to: {
                top: `${(minimap.bottom + (ammo.hasWeapon ? -0.035 : 0.005)) * 100}vh`,
                right: `${(minimap.left + 0.005) * 100}vw`,
            },
        }),
        [ammo, minimap]
    );

    const [voiceIcon, disableAutoHide] = useMemo(() => {
        if (!voiceActive) {
            return ['disconnected', true];
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

    return (
        <>
            <animated.div
                className="absolute flex gap-1 items-center justify-center text-white w-fit"
                style={ammoStyles}
            >
                <div className="flex flex-col justify-center items-center tabular-nums h-11">
                    <span className="text-3xl leading-7">{ammo?.ammo}</span>
                    <span className="text-xl leading-5 text-white/50 font-light">{ammo?.maxAmmo}</span>
                </div>
                <img className="size-12 mb-1" src="/public/images/hud/ammo.webp" alt="ammo" />
            </animated.div>

            <animated.div className="absolute size-12" style={voiceStyles}>
                <VoiceIcon icon={voiceIcon} disableAutoHide={disableAutoHide} />
            </animated.div>
        </>
    );
};
