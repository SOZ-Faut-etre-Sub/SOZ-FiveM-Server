import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

export const AppContent: FunctionComponent<any> = ({ children, className, scrollable = true }) => {
    return (
        <div
            className={clsx(
                'flex flex-col grow w-full px-4',
                {
                    'overflow-y-auto scrollbar scrollbar-w-[5px] scrollbar-thumb-white/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full':
                        scrollable,
                    'overflow-y-hidden': !scrollable,
                },
                className
            )}
        >
            {children}
        </div>
    );
};
