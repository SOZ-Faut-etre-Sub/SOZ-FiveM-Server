import { LoadingSpinner } from '@ui/old_components/LoadingSpinner';
import React from 'react';

export const AppContent: React.FC<any> = ({ children, disableSuspenseHandler, ...props }) => {
    return (
        <div className="mt-4" {...props}>
            {!disableSuspenseHandler ? (
                <React.Suspense fallback={<LoadingSpinner />}>{children}</React.Suspense>
            ) : (
                { children }
            )}
        </div>
    );
};
