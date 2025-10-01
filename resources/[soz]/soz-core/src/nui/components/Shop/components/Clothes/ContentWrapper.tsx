import React, { FunctionComponent, PropsWithChildren } from 'react';

export const ContentWrapper: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {children}
        </div>
    );
};

export const ContentGridWrapper: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <div className="grid grid-cols-3 gap-4 p-4">{children}</div>;
};
