import cn from 'classnames';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import { useConfig } from '../../hooks/usePhone';

export const NavBarContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const config = useConfig();

    return (
        <div
            className={cn('absolute bottom-0 inset-x-0 grid grid-cols-3 content-start h-20', {
                'bg-[#1C1C1E] text-white': config.theme.value === 'dark',
                'bg-white text-black': config.theme.value === 'light',
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
