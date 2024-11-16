import { animated, useSpring } from '@react-spring/web';
import classnames from 'classnames';
import React, { FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react';

import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';

interface AppContentProps extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
}

export const AppContent: FunctionComponent<PropsWithChildren<AppContentProps>> = ({
    children,
    className,
    open = false,
}) => {
    const [styles] = useSpring(
        () => ({
            from: {
                opacity: 0,
                transform: 'translateY(100vh)',
            },
            to: {
                opacity: 1,
                transform: open ? 'translateY(0)' : 'translateY(100vh)',
            },
        }),
        [open]
    );

    return (
        <animated.div style={styles} className="flex h-full w-full overflow-hidden shadow-2xl">
            <GlassMorphismContainer
                borderClassName="rounded-3xl"
                className={classnames('flex gap-10 h-full w-full p-10', className)}
            >
                {children}
            </GlassMorphismContainer>
        </animated.div>
    );
};
