import React, {useContext} from 'react';
import {AppWrapperTypes} from '../interface/InterfaceUI';
import {useRouteMatch} from "react-router-dom";
import {ThemeContext} from "../../styles/themeProvider";
import cn from 'classnames';
import {css} from '@emotion/css'

const wrapperStyle = css`
    display: flex;
`

export const AppWrapper: React.FC<AppWrapperTypes> = ({
    children,
    className
}) => {
    const home = useRouteMatch('/');
    const camera = useRouteMatch('/camera');
    const {theme} = useContext(ThemeContext);

    const color = () => {
        if (home && !home.isExact) {
            if (camera && camera.isExact) {
                return 'bg-black'
            }
            return theme === 'dark' ? 'bg-black' : 'bg-[#F2F2F6]'
        }
        return ''
    }

    return (
        <div className={cn(wrapperStyle, 'p-0 m-0 relative flex-col h-full w-full min-h-[700px]', className, color())}>
            {children}
        </div>
    );
};
