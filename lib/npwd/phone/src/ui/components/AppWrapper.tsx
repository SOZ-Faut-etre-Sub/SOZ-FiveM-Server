import React, {useContext, useEffect, useRef} from 'react';
import {AppWrapperTypes} from '../interface/InterfaceUI';
import {useRouteMatch} from "react-router-dom";
import {ThemeContext} from "../../styles/themeProvider";

export const AppWrapper: React.FC<AppWrapperTypes> = ({
    children,
    className
}) => {
    const appRef = useRef(null);
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

    useEffect(() => {
        appRef.current.animate([
            {transform: 'scale(0) translateY(-50%)'}, {transform: 'scale(1.0) translateY(0)'}
        ], {duration: 300});
    }, []);

    return (
        <div ref={appRef} className={`${color()} p-0 m-0 relative flex flex-col h-full w-full min-h-[720px] ${className}`}>
            {children}
        </div>
    );
};
