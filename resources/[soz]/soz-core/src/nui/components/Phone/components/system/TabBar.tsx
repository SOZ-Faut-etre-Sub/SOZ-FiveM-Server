import clsx from 'clsx';
import { FunctionComponent, memo, PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { NavBarOption } from '../../../../../shared/phone/app';
import { useThemeConfig } from '../../system/config/config.atom';

interface TabBarProps {
    options: NavBarOption[];
}

export const TabBar: FunctionComponent<TabBarProps> = memo(({ options = [] }) => {
    const { pathname } = useLocation();

    if (options.length === 0) {
        return null;
    }

    return (
        <TabBarContainer>
            {options.map(({ label, path, icon: Icon }, index) => (
                <TabBarButton key={index} active={pathname === path} path={path}>
                    <Icon className="size-5" /> {label}
                </TabBarButton>
            ))}
        </TabBarContainer>
    );
});

export const TabBarContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const theme = useThemeConfig();

    return (
        <div
            className={clsx('absolute bottom-0 inset-x-0 flex justify-around items-start gap-2 h-20', {
                'bg-ios-700 text-white': theme === 'dark',
                'bg-white text-black': theme === 'light',
            })}
        >
            {children}
        </div>
    );
};

export const TabBarButton: FunctionComponent<PropsWithChildren<{ active: boolean; path: string }>> = ({
    children,
    active,
    path,
}) => {
    return (
        <Link
            to={path}
            className={clsx('flex flex-col items-center py-2 text-sm', {
                'text-[#347DD9]': active,
            })}
        >
            {children}
        </Link>
    );
};
