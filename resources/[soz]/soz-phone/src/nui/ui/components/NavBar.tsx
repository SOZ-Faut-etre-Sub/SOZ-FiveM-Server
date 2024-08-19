import cn from 'classnames';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import { useConfig } from '../../hooks/usePhone';

interface PropsWithBigHeader {
    hasBigHeader?: boolean;
    hasNoTitle?: boolean;
}

export const NavBarContainer: FunctionComponent<PropsWithChildren<PropsWithBigHeader>> = ({
    children,
    hasBigHeader,
    hasNoTitle,
}) => {
    const config = useConfig();

    return (
        <div
            className={cn('absolute inset-x-0 grid grid-cols-3 content-start h-20', {
                'bg-ios-700 text-white': config.theme.value === 'dark',
                'bg-white text-black': config.theme.value === 'light',
                '-bottom-3.5': !hasBigHeader,
                'bottom-3': hasBigHeader,
                '-bottom-16': hasNoTitle,
            })}
        >
            {children}
        </div>
    );
};

export const NavBarButton: FunctionComponent<PropsWithChildren<{ active: boolean; path: string }>> = ({
    children,
    active,
    path,
}) => {
    return (
        <Link
            to={path}
            className={cn('flex flex-col items-center py-2 text-sm', {
                'text-[#347DD9]': active,
            })}
        >
            {children}
        </Link>
    );
};
