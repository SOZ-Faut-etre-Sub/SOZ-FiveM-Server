import clsx from 'clsx';
import React, { HTMLAttributes, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { IAppConfig } from '../../../../../shared/phone/app';
import { useIsInViewport } from '../../../../hook/viewport';
import { useAppTitleUpdater } from '../../system/apps/hooks/useAppTitleUpdater';
import { useThemeConfig } from '../../system/config/config.atom';

interface AppTitleProps extends HTMLAttributes<HTMLDivElement> {
    app?: IAppConfig;
    title?: string;
    subtitle?: string;
    isBigHeader?: boolean;
}

export const AppTitle: React.FC<AppTitleProps> = ({ app, title, subtitle, isBigHeader }) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();

    const ref = useRef();
    const theme = useThemeConfig();
    const inViewport = useIsInViewport(ref);

    title = title ? title : t(app.nameLocale);

    useAppTitleUpdater(!inViewport, title);

    return (
        <div
            ref={ref}
            className={clsx('px-5 transition-all duration-300 ease-in-out pb-2', {
                'bg-ios-800': theme === 'dark' || pathname.includes('/camera'),
                'bg-ios-50': theme === 'light' && !pathname.includes('/camera'),
                'bg-transparent': pathname.includes('/darkweb'),
            })}
        >
            <h2
                className={clsx('font-semibold tracking-wide transition-all duration-300 ease-in-out', {
                    'text-gray-200': theme === 'dark',
                    'text-black': theme === 'light',
                    'text-teal-400': pathname.includes('/darkweb'),
                    'pt-8 text-3xl': isBigHeader,
                    'text-2xl': !isBigHeader,
                })}
            >
                <div className="flex flex-col truncate col-span-4 text-left">
                    {title}
                    {subtitle != null && <span className="truncate text-gray-500 text-sm">{subtitle}</span>}
                </div>
            </h2>
        </div>
    );
};
