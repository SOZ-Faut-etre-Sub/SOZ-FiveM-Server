import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import { FunctionComponent, memo, PropsWithChildren } from 'react';

import { useBackground } from '../hooks/useBackground';
import { NavigationBar } from './NavigationBar';
import { TopHeaderBar } from './TopHeaderBar';

interface AppContainerProps extends PropsWithChildren {
    withHeader?: boolean;
    withNavBar?: boolean;
    disableBackground?: boolean;
}

export const AppContainer: FunctionComponent<AppContainerProps> = memo(
    ({ children, disableBackground = false, withHeader = true, withNavBar = true }) => {
        const backgroundClass = useBackground();

        const styles = useSpring({
            from: {
                opacity: 0,
                transform: `scale(0)`,
            },
            to: {
                opacity: 1,
                transform: `scale(1)`,
            },
        });

        return (
            <animated.div
                style={styles}
                className={clsx('flex flex-col h-full w-full', {
                    [backgroundClass]: !disableBackground,
                })}
            >
                {withHeader && <TopHeaderBar />}
                {children}
                {withNavBar && <NavigationBar />}
            </animated.div>
        );
    }
);
