import React, {HTMLAttributes} from 'react';
import {useTranslation} from 'react-i18next';
import {IApp} from '@os/apps/config/apps';

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
    return (
        <div className={`${isBigHeader ? 'h-32' : 'h-24'} absolute -top-16 inset-x-0 bg-black px-5 pt-12 transition-all duration-300 ease-in-out z-30`}>
            <h2 className={`grid grid-cols-4 text-gray-200 ${isBigHeader ? 'pt-8 text-3xl' : 'pt-3 text-2xl'} ${children && 'text-xl'} font-semibold tracking-wide transition-all duration-300 ease-in-out`}>
                {children && <div className="flex items-center text-[#347DD9]">{children}</div>}
                <div className={`${(!children && !action) ? 'col-span-4 text-left' : 'col-span-2 text-center'} `}>{title ? title : t(app.nameLocale)}</div>
                {action && <div className="justify-self-end text-[#347DD9]">{action}</div>}
            </h2>
        </div>
    );
};
