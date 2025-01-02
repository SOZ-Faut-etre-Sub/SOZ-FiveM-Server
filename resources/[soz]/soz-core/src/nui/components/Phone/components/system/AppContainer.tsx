import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import { FunctionComponent, memo, PropsWithChildren } from 'react';

import { useBackgroundClasses } from '../../hooks/useBackgroundClasses';
import { NavigationBar } from './NavigationBar';
import { StatusBar } from './StatusBar';

interface AppContainerProps extends PropsWithChildren {
    withHeader?: boolean;
    withNavBar?: boolean;
    disableBackground?: boolean;
}

export const AppContainer: FunctionComponent<AppContainerProps> = memo(
    ({ children, disableBackground = false, withHeader = true, withNavBar = true }) => {
        const backgroundClass = useBackgroundClasses();

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
                {withHeader && <StatusBar />}
                {children}
                {withNavBar && <NavigationBar />}
            </animated.div>
        );
    }
);
