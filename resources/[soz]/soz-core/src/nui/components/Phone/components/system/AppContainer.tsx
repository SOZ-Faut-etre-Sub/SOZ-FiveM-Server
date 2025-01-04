import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import { FunctionComponent, memo, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { NavBarOption } from '../../../../../shared/phone/app';
import { useBackgroundClasses } from '../../hooks/useBackgroundClasses';
import { NavigationBar } from './NavigationBar';
import { StatusBar } from './StatusBar';
import { TabBar } from './TabBar';

interface AppContainerProps extends PropsWithChildren {
    tabBarOptions?: NavBarOption[];

    withHeader?: boolean;
    withNavBar?: boolean;
    disableBackground?: boolean;
}

export const AppContainer: FunctionComponent<AppContainerProps> = memo(
    ({ children, tabBarOptions, disableBackground = false, withHeader = true, withNavBar = true }) => {
        const { pathname } = useLocation();
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
                    'pb-7': pathname !== '/',
                })}
            >
                {withHeader && <StatusBar />}
                {children}
                {tabBarOptions && <TabBar options={tabBarOptions} />}
                {withNavBar && <NavigationBar />}
            </animated.div>
        );
    }
);
