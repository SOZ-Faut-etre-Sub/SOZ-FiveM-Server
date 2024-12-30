import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

export const AppContent: FunctionComponent<any> = ({ children, className, scrollable = true }) => {
    return (
        <div
            className={clsx(
                'flex flex-col grow w-full px-4',
                {
                    'overflow-y-auto': scrollable,
                },
                className
            )}
        >
            {children}
        </div>
    );
};
