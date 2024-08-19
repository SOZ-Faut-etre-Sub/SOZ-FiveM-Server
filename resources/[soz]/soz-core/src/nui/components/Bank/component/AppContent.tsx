import classnames from 'classnames';
import React, { forwardRef, FunctionComponent, PropsWithChildren } from 'react';

export const AppContent: FunctionComponent = forwardRef<HTMLDivElement, PropsWithChildren<{ className?: string }>>(
    ({ children, className }, ref) => {
        return (
            <div
                ref={ref}
                className={classnames(
                    'flex gap-4 bg-gradient-to-b from-[#0B302E] to-[#082524] from-60%  text-white/80 h-full w-full rounded-2xl p-4 shadow-2xl overflow-hidden',
                    className
                )}
            >
                {children}
            </div>
        );
    }
);
