import clsx from 'clsx';
import React, { FunctionComponent, PropsWithChildren } from 'react';

interface AppWrapperProps extends PropsWithChildren {
    className?: string;
}

export const AppWrapper: FunctionComponent<AppWrapperProps> = ({ children, className }) => {
    return (
        <div
            className={clsx(
                'grow overflow-y-auto scrollbar scrollbar-w-[5px] scrollbar-thumb-white/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
                className
            )}
        >
            {children}
        </div>
    );
};
