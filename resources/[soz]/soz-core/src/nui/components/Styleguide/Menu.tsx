import { FunctionComponent, PropsWithChildren } from 'react';

export const MenuContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <div className="absolute left-8 top-8 w-1/4 max-h-[50vh]">{children}</div>;
};

export const MenuTitle: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <div className="text-2xl font-bold">{children}</div>;
};

export const MenuContent: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <ul>{children}</ul>;
};

export const MenuItem: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <li className="text-xl">{children}</li>;
};
