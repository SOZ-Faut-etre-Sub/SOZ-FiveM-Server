import cn from 'classnames';
import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import { Link } from 'react-router-dom';

import { ThemeContext } from '../../styles/themeProvider';

export const NavBarContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div
            className={`absolute bottom-0 inset-x-0 grid grid-cols-3 content-start ${
                theme === 'dark' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-black'
            } h-20`}
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
