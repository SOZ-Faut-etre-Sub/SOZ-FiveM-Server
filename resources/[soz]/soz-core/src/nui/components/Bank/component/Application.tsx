import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent, PropsWithChildren } from 'react';

import { useOutside } from '../../../hook/outside';

interface ApplicationContainerProps {
    size: 'full' | 'large' | 'small';
    onClickOutside?: () => void;
}

export const ApplicationContainer: FunctionComponent<PropsWithChildren<ApplicationContainerProps>> = ({
    children,
    size,
    onClickOutside,
}) => {
    const backgroundStyles = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
    });

    const contentStyles = useSpring({
        from: { y: 50, opacity: 0 },
        to: { y: 0, opacity: 1 },
    });

    const refOutside = useOutside({
        down: event => {
            if (!onClickOutside) return;

            let el = event.target;
            while (el.parentNode) {
                el = el.parentNode;
                if (el.getAttribute && el.getAttribute('data-ignore-click-outside')) return;
            }

            onClickOutside();
        },
    });

    return (
        <>
            <div className="absolute flex justify-center items-center h-full w-full">
                <animated.div
                    ref={refOutside}
                    style={contentStyles}
                    className={cn('h-full w-full mx-auto my-auto', {
                        'max-w-[1536px] max-h-[90vh]': size === 'full',
                        'max-h-[400px] max-w-[700px]': size === 'large',
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
