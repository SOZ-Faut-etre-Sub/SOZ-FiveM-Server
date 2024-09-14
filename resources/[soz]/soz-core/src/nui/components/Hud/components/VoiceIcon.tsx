import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent, useEffect, useState } from 'react';

export const VoiceIcon: FunctionComponent<{ icon: string; disableAutoHide?: boolean }> = ({
    icon,
    disableAutoHide,
}) => {
    const [show, setShow] = useState(true);
    const [timeout, initTimeout] = useState<NodeJS.Timeout>(null);

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
        <animated.div style={styles}>
            <img className="size-12" src={`/public/images/hud/voice/${icon}.webp`} alt={icon} />
        </animated.div>
    );
};
