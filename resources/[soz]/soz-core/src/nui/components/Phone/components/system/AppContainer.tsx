import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import { FunctionComponent, memo, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { NavBarOption } from '../../../../../shared/phone/app';
import { useBackgroundClasses } from '../../hooks/useBackgroundClasses';
import { useLastCursorPosition } from '../../system/phone.atom';
import { NavigationBar } from './NavigationBar';
import { StatusBar } from './StatusBar';
import { TabBar } from './TabBar';

interface AppContainerProps extends PropsWithChildren {
    className?: string;
    tabBarOptions?: NavBarOption[];
    forceControlColor?: 'light' | 'dark';
    withHeader?: boolean;
    withNavBar?: boolean;
    disableBackground?: boolean;
}

export const AppContainer: FunctionComponent<AppContainerProps> = memo(
    ({
        children,
        className,
        tabBarOptions,
        forceControlColor,
        disableBackground = false,
        withHeader = true,
        withNavBar = true,
    }) => {
        const { pathname } = useLocation();
        const backgroundClass = useBackgroundClasses();
        const lastCursorPosition = useLastCursorPosition();

        const transformOrigin = pathname === '/' ? 'center' : `${lastCursorPosition.x}px ${lastCursorPosition.y}px`;

        const styles = useSpring({
            from: {
                opacity: 0,
                transform: `scale(0)`,
                transformOrigin,
            },
            to: {
                opacity: 1,
                transform: `scale(1)`,
                transformOrigin,
            },
        });

        return (
            <animated.div
                style={styles}
                className={clsx('flex flex-col h-full w-full', className, {
                    [backgroundClass]: !disableBackground,
                    'pb-7': pathname !== '/',
                })}
            >
                {withHeader && <StatusBar forceControlColor={forceControlColor} />}
                {children}
                {tabBarOptions && <TabBar options={tabBarOptions} />}
                {withNavBar && <NavigationBar forceControlColor={forceControlColor} />}
            </animated.div>
        );
    }
);
