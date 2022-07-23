import { IApp } from '@os/apps/config/apps';
import React, { HTMLAttributes, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { ThemeContext } from '../../styles/themeProvider';

interface AppTitleProps extends HTMLAttributes<HTMLDivElement> {
    app?: IApp;
    title?: string;
    action?: JSX.Element;
    isBigHeader?: boolean;
}

export const AppTitle: React.FC<AppTitleProps> = ({ app, title, isBigHeader, action, children }) => {
    const [t] = useTranslation();
    const { theme } = useContext(ThemeContext);
    const { pathname } = useLocation();

    return (
        <div
            className={`${
                theme === 'dark' ? 'bg-black' : pathname.includes('/camera') ? 'bg-black' : 'bg-ios-50'
            } px-5 transition-all duration-300 ease-in-out pb-2`}
        >
            <h2
                className={`grid grid-cols-4 ${theme === 'dark' ? 'text-gray-200' : 'text-black'} ${
                    isBigHeader ? 'pt-8 text-3xl' : 'pt-3 text-2xl'
                } ${children && 'text-xl'} font-semibold tracking-wide transition-all duration-300 ease-in-out`}
            >
                {children && <div className="flex items-center text-[#347DD9]">{children}</div>}
                <div
                    className={`truncate ${!children && !action ? 'col-span-4 text-left' : 'col-span-2 text-center'} `}
                >
                    {title ? title : t(app.nameLocale)}
                </div>
                {action && <div className="justify-self-end text-[#347DD9] font-normal text-base">{action}</div>}
            </h2>
        </div>
    );
};
