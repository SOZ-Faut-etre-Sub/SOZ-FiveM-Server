import classnames from 'classnames';
import React, { forwardRef, FunctionComponent, PropsWithChildren } from 'react';

import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';

export const AppContent: FunctionComponent = forwardRef<HTMLDivElement, PropsWithChildren<{ className?: string }>>(
    ({ children, className }, ref) => {
        return (
            <div ref={ref} className="flex h-full w-full overflow-hidden shadow-2xl">
                <GlassMorphismContainer
                    borderClassName="rounded-3xl"
                    className={classnames('flex gap-10 h-full w-full p-10', className)}
                >
                    {children}
                </GlassMorphismContainer>
            </div>
        );
    }
);
