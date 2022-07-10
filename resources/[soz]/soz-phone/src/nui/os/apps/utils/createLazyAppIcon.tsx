import React, { Suspense } from 'react';

export const createLazyAppIcon =
    (Icon: React.FC<any>, props = {}): React.FC =>
    () => {
        return (
            <Suspense fallback={<div {...props} />}>
                <Icon {...props} />
            </Suspense>
        );
    };
