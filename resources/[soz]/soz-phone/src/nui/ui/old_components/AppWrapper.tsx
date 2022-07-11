import { css } from '@emotion/css';
import cn from 'classnames';
import React, { PropsWithChildren, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { ThemeContext } from '../../styles/themeProvider';
import { AppWrapperTypes } from '../interface/InterfaceUI';

const wrapperStyle = css`
    display: flex;
`;

export const AppWrapper: React.FC<PropsWithChildren<AppWrapperTypes>> = ({ children, className }) => {
    const { pathname } = useLocation();
    const { theme } = useContext(ThemeContext);

    const color = () => {
        if (pathname.includes('/camera')) {
            return 'bg-black';
        }
        if (pathname !== '/') {
            return theme === 'dark' ? 'bg-black' : 'bg-[#F2F2F6]';
        }
        return '';
    };

    return (
        <div className={cn(wrapperStyle, 'p-0 m-0 relative flex-col h-full w-full min-h-[700px]', className, color())}>
            {children}
        </div>
    );
};
