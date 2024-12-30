import { IApp } from '@os/apps/config/apps';
import cn from 'classnames';
import React, { HTMLAttributes, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { useIsInViewport } from '../../common/hooks/viewport';
import { useConfig } from '../../hooks/usePhone';
import { Dispatch } from '../../store';

interface AppTitleProps extends HTMLAttributes<HTMLDivElement> {
    app?: IApp;
    title?: string;
    subtitle?: string;
    action?: JSX.Element;
    isBigHeader?: boolean;
}

export const AppTitle: React.FC<AppTitleProps> = ({ app, title, subtitle, isBigHeader, action, children }) => {
    const [t] = useTranslation();
    const config = useConfig();
    const { pathname } = useLocation();
    const ref = useRef();

    const dispatch = useDispatch<Dispatch>();
    const inViewport = useIsInViewport(ref);

    title = title ? title : t(app.nameLocale);

    useEffect(() => {
        dispatch.appCommon.setTitle(title);

        return () => {
            dispatch.appCommon.displayTitle(false);
            dispatch.appCommon.setTitle(null);
        };
    }, []);

    useEffect(() => {
        dispatch.appCommon.displayTitle(!inViewport);
    }, [inViewport]);

    return (
        <div
            ref={ref}
            className={cn('px-5 transition-all duration-300 ease-in-out pb-2', {
                'bg-ios-800': config.theme.value === 'dark' || pathname.includes('/camera'),
                'bg-ios-50': config.theme.value === 'light' && !pathname.includes('/camera'),
                'bg-transparent': pathname.includes('/darkweb'),
            })}
        >
            <h2
                className={cn('grid grid-cols-4 font-semibold tracking-wide transition-all duration-300 ease-in-out', {
                    'text-gray-200': config.theme.value === 'dark',
                    'text-black': config.theme.value === 'light',
                    'text-teal-400': pathname.includes('/darkweb'),
                    'pt-8 text-3xl': isBigHeader,
                    'text-2xl': !isBigHeader,
                    'text-xl': children,
                    'grid-rows-2': subtitle != null,
                    'grid-rows-1': subtitle == null,
                })}
            >
                {children && <div className="flex items-center text-[#347DD9]">{children}</div>}
                <div
                    className={cn('truncate', {
                        'col-span-4 text-left': !children && !action,
                        'col-span-2 text-center': children,
                    })}
                >
                    {title}
                </div>
                {action && <div className="justify-self-end text-[#347DD9] font-normal text-base">{action}</div>}
                {subtitle != null && <div className={cn('truncate text-center text-sm col-span-4')}>{subtitle}</div>}
            </h2>
        </div>
    );
};
