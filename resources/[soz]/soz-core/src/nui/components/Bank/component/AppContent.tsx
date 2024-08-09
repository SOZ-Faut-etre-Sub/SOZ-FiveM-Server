import classnames from 'classnames';
import React, { forwardRef, FunctionComponent, PropsWithChildren } from 'react';

export const AppContent: FunctionComponent = forwardRef<HTMLDivElement, PropsWithChildren<{ className?: string }>>(
    ({ children, className }, ref) => {
        return (
            <div
                ref={ref}
                className={classnames(
                    'flex gap-4 bg-gradient-to-b from-teal-950 to-stone-800 text-white/80 h-full w-full rounded-2xl p-4 shadow-2xl overflow-hidden',
                    className
                )}
            >
                {children}
            </div>
        );
    }
);
