import React, {HTMLAttributes} from 'react';
import {useTranslation} from 'react-i18next';
import {IApp} from '@os/apps/config/apps';

interface AppTitleProps extends HTMLAttributes<HTMLDivElement> {
    app: IApp
    isBigHeader?: boolean
}

export const AppTitle: React.FC<AppTitleProps> = ({
    app: {nameLocale},
    isBigHeader
}) => {
    const [t] = useTranslation();
    return (
        <div className={`${isBigHeader ? 'h-32' : 'h-24'} absolute -top-16 inset-x-0 bg-gray-900 bg-opacity-50 backdrop-blur px-5 pt-12 transition-all duration-300 ease-in-out z-30`}>
            <h2 className={`text-gray-200 ${isBigHeader ? 'pt-8 text-3xl' : 'text-2xl'} font-semibold tracking-wide transition-all duration-300 ease-in-out`}>{t(nameLocale)}</h2>
        </div>
    );
};
