import React, { FunctionComponent, PropsWithChildren } from 'react';

type DividerProps = {
    title?: string;
};

export const MenuGroup: FunctionComponent<PropsWithChildren<DividerProps>> = ({ title, children }) => {
    return (
        <div>
            {title && <h2 className="px-2 text-lg font-semibold uppercase pb-5">{title}</h2>}
            {children}
        </div>
    );
};
