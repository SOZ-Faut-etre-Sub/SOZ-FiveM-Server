import React, {HTMLAttributes, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {IApp} from '@os/apps/config/apps';
import {ThemeContext} from "../../styles/themeProvider";
import {useRouteMatch} from "react-router-dom";

interface AppTitleProps extends HTMLAttributes<HTMLDivElement> {
    app?: IApp
    title?: string
    action?: JSX.Element
    isBigHeader?: boolean
}

export const AppTitle: React.FC<AppTitleProps> = ({
    app,
    title,
    isBigHeader,
    action,
    children
}) => {
    const [t] = useTranslation();
    const {theme} = useContext(ThemeContext);
    const camera = useRouteMatch('/camera');

    return (
        <div className={`${isBigHeader ? 'h-32' : 'h-24'} absolute -top-16 inset-x-0 ${theme === 'dark' ? 'bg-black' : (camera && camera.isExact) ? 'bg-black' : 'bg-[#F2F2F6]'} px-5 pt-12 transition-all duration-300 ease-in-out z-30`}>
            <h2 className={`grid grid-cols-4 ${theme === 'dark' ? 'text-gray-200' : 'text-black'} ${isBigHeader ? 'pt-8 text-3xl' : 'pt-3 text-2xl'} ${children && 'text-xl'} font-semibold tracking-wide transition-all duration-300 ease-in-out`}>
                {children && <div className="flex items-center text-[#347DD9]">{children}</div>}
                <div className={`${(!children && !action) ? 'col-span-4 text-left' : 'col-span-2 text-center'} `}>{title ? title : t(app.nameLocale)}</div>
                {action && <div className="justify-self-end text-[#347DD9]">{action}</div>}
            </h2>
        </div>
    );
};
