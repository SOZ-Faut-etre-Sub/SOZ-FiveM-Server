import React, { FunctionComponent, PropsWithChildren } from 'react';

type DividerProps = {
    title?: string;
};

export const MenuGroup: FunctionComponent<PropsWithChildren<DividerProps>> = ({ title, children }) => {
    return (
        <div className="bg-black/10 shadow-md rounded-md p-1 space-y-1">
            {title && <span className="px-2 text-sm font-semibold text-gray-400/30">{title}</span>}
            {children}
        </div>
    );
};
