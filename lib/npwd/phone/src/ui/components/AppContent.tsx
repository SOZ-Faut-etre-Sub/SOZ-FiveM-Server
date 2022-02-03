import React from 'react';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';

export const AppContent: React.FC<any> = ({
    children,
    paperStyle,
    backdrop,
    disableSuspenseHandler,
    onClickBackdrop,
    ...props
}) => {
    return (
        <div className="mt-4" {...props}>
            {!disableSuspenseHandler ? (
                <React.Suspense fallback={<LoadingSpinner/>}>
                    {children}
                </React.Suspense>
            ) : (
                {children}
            )}
        </div>
    );
};
