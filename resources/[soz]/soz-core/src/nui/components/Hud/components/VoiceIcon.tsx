import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent, useEffect, useState } from 'react';

import { useZoom } from '../hooks/useZoom';

export const VoiceIcon: FunctionComponent<{ icon: string; disableAutoHide?: boolean }> = ({
    icon,
    disableAutoHide,
}) => {
    const [show, setShow] = useState(true);
    const [timeout, initTimeout] = useState<NodeJS.Timeout>(null);

    const { width, height } = useZoom();

    useEffect(() => {
        clearTimeout(timeout);
        setShow(true);

        initTimeout(
            setTimeout(() => {
                setShow(disableAutoHide);
            }, 3000)
        );
    }, [icon, disableAutoHide]);

    const styles = useSpring({
        from: {
            opacity: 0,
        },
        to: {
            opacity: show ? 1 : 0,
        },
    });

    return (
        <animated.div
            className="bg-cover bg-center"
            style={{
                ...styles,
                width,
                height,
                backgroundImage: `url(https://soz.zerator.com/static/game/images/hud/voice/${icon}.webp)`,
            }}
        />
    );
};
