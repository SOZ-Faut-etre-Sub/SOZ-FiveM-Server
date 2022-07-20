import cn from 'classnames';
import React, { FunctionComponent } from 'react';

export const AppContent: FunctionComponent<any> = ({ children, className, scrollable = true }) => {
    return (
        <div
            className={cn(
                'h-[755px] w-full px-2',
                {
                    'overflow-y-auto pb-16': scrollable,
                },
                className
            )}
        >
            {children}
        </div>
    );
};
