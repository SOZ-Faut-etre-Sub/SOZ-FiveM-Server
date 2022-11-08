import { IApp } from '@os/apps/config/apps';
import cn from 'classnames';
import React, { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useConfig } from '../../hooks/usePhone';

interface AppTitleProps extends HTMLAttributes<HTMLDivElement> {
    app?: IApp;
    title?: string;
    action?: JSX.Element;
    isBigHeader?: boolean;
}

export const AppTitle: React.FC<AppTitleProps> = ({ app, title, isBigHeader, action, children }) => {
    const [t] = useTranslation();
    const config = useConfig();
    const { pathname } = useLocation();

    return (
        <div
            className={cn('px-5 transition-all duration-300 ease-in-out pb-2', {
                'bg-ios-800': config.theme.value === 'dark' || pathname.includes('/camera'),
                'bg-ios-50': config.theme.value === 'light' && !pathname.includes('/camera'),
            })}
        >
            <h2
                className={cn('grid grid-cols-4 font-semibold tracking-wide transition-all duration-300 ease-in-out', {
                    'text-gray-200': config.theme.value === 'dark',
                    'text-black': config.theme.value === 'light',
                    'pt-8 text-3xl': isBigHeader,
                    'pt-3 text-2xl': !isBigHeader,
                    'text-xl': children,
                })}
            >
                {children && <div className="flex items-center text-[#347DD9]">{children}</div>}
                <div
                    className={cn('truncate', {
                        'col-span-4 text-left': !children && !action,
                        'col-span-2 text-center': children && action,
                    })}
                >
                    {title ? title : t(app.nameLocale)}
                </div>
                {action && <div className="justify-self-end text-[#347DD9] font-normal text-base">{action}</div>}
            </h2>
        </div>
    );
};
