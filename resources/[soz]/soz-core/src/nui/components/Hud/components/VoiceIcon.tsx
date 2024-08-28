import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

export const VoiceIcon: FunctionComponent<{ icon: string; disableAutoHide?: boolean }> = ({
    icon,
    disableAutoHide,
}) => {
    const show = useRef(true);
    const [timeout, initTimeout] = useState<NodeJS.Timeout>(null);

    useEffect(() => {
        clearTimeout(timeout);
        show.current = true;

        if (disableAutoHide) return;

        initTimeout(
            setTimeout(() => {
                show.current = false;
            }, 3000)
        );
    }, [icon, disableAutoHide]);

    const styles = useSpring({
        from: {
            opacity: '0',
        },
        to: {
            opacity: show.current ? '1' : '0',
        },
    });

    return (
        <animated.div style={styles}>
            <img className="size-12" src={`/public/images/hud/voice/${icon}.webp`} alt={icon} />
        </animated.div>
    );
};
