import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent, PropsWithChildren } from 'react';

import { useOutside } from '../../../hook/outside';
import { useHudColor } from '../../Hud/hooks/useHudColor';

interface ApplicationContainerProps {
    size: 'full' | 'large' | 'small';
    onClickOutside?: () => void;
}

export const ApplicationContainer: FunctionComponent<PropsWithChildren<ApplicationContainerProps>> = ({
    children,
    size,
    onClickOutside,
}) => {
    const { color } = useHudColor();

    const backgroundStyles = useSpring({
        from: { opacity: 0 },
        to: { opacity: 0.99999 }, // prevent black background when doing backdrop-blur
    });

    const contentStyles = useSpring({
        from: { y: 50, opacity: 0 },
        to: { y: 0, opacity: 0.99999, color }, // prevent black background when doing backdrop-blur
    });

    const refOutside = useOutside({
        down: event => {
            if (!onClickOutside) return;

            let el = event.target as HTMLElement;
            while (el.parentNode) {
                el = el.parentNode as HTMLElement;
                if (el.getAttribute && el.getAttribute('data-ignore-click-outside')) return;
            }

            onClickOutside();
        },
    });

    return (
        <>
            <div className="absolute font-prompt flex justify-center items-center h-full w-full z-10 overflow-hidden">
                <animated.div
                    ref={refOutside}
                    style={contentStyles}
                    className={cn('h-full w-full mx-auto my-auto', {
                        'max-h-[850px] max-w-[1536px]': size === 'full',
                        'max-h-[450px] max-w-[700px]': size === 'large',
                        'max-h-[800px] max-w-[536px]': size === 'small',
                    })}
                >
                    {children}
                </animated.div>
                <animated.div style={backgroundStyles} className="absolute bg-black/35 h-full w-full -z-10" />
            </div>
        </>
    );
};
