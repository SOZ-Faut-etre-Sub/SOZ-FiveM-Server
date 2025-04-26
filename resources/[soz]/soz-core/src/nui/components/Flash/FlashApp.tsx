import { useNuiEvent } from '@public/nui/hook/nui';
import { Vector3 } from '@public/shared/polyzone/vector';
import { animated, easings, useSpring } from '@react-spring/web';
import { FunctionComponent, useEffect, useState } from 'react';

export const FlashApp: FunctionComponent = () => {
    const [flash, setFlash] = useState<boolean>(false);
    const [init, setInit] = useState<boolean>(false);
    const [timeout, initTimeout] = useState<NodeJS.Timeout>(null);
    const [coords, setCoords] = useState<Vector3>([0, 0, 0]);

    useEffect(() => {
        if (flash) {
            clearTimeout(timeout);

            initTimeout(
                setTimeout(() => {
                    setFlash(false);
                }, 3000)
            );
        }
    }, [flash]);

    useNuiEvent('flash', 'setFlash', inputCoords => {
        setCoords(inputCoords);
        setFlash(true);
        setInit(true);
    });

    const styles = useSpring({
        from: {
            opacity: flash ? 0 : 1,
        },
        to: {
            opacity: flash ? 1 : 0,
        },
        config: {
            duration: flash ? 100 : 5000,
            easing: easings.easeInOutExpo,
        },
    });

    const background = `radial-gradient(circle at ${(coords[0] * 100).toFixed(0)}% ${(coords[1] * 100).toFixed(0)}%, rgba(255,255,255,1) 0%, rgba(142,142,142,1) 8%, rgba(255,255,255,${coords[2]}) 100%)`;

    if (!init) {
        return null;
    }

    return (
        <animated.div
            className="w-full h-full bg-white absolute -z-10"
            style={{
                ...styles,
                background: background,
            }}
        />
    );
};
