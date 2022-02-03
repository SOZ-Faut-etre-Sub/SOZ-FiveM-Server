import React, {HTMLAttributes} from 'react';
import {useTranslation} from 'react-i18next';
import {IApp} from '@os/apps/config/apps';
import {ChevronLeftIcon} from "@heroicons/react/outline";
import {Button} from "@ui/components/Button";

interface AppTitleProps extends HTMLAttributes<HTMLDivElement> {
    app?: IApp
    title?: string
    isBigHeader?: boolean
}

export const AppTitle: React.FC<AppTitleProps> = ({
    app,
    title,
    isBigHeader,
    children
}) => {
    const [t] = useTranslation();
    return (
        <div className={`${isBigHeader ? 'h-32' : 'h-24'} absolute -top-16 inset-x-0 bg-gray-900 bg-opacity-50 backdrop-blur px-5 pt-12 transition-all duration-300 ease-in-out z-30`}>
            <h2 className={`grid grid-cols-4 text-gray-200 ${isBigHeader ? 'pt-8 text-3xl' : 'pt-3 text-2xl'} ${children && 'text-xl'} font-semibold tracking-wide transition-all duration-300 ease-in-out`}>
                {children && <div className="flex items-center text-[#347DD9]">{children}</div>}
                <div className="col-span-3">{title ? title : t(app.nameLocale)}</div>
            </h2>
        </div>
    );
};
