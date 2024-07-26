import classnames from 'classnames';
import React, { forwardRef, FunctionComponent, PropsWithChildren } from 'react';

export const AppContainer: FunctionComponent = forwardRef<HTMLDivElement, PropsWithChildren<{ className?: string }>>(
    ({ children, className }, ref) => {
        return (
            <div
                ref={ref}
                className={classnames(
                    'flex gap-4 bg-gradient-to-br from-[#1c2128] via-[#1c2826] to-[#1c2128] text-white/80 h-full w-full rounded-2xl p-4 overflow-hidden',
                    className
                )}
            >
                {children}
            </div>
        );
    }
);
