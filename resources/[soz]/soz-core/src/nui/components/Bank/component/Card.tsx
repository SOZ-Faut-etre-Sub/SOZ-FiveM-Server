import classnames from 'classnames';
import React, { FunctionComponent, PropsWithChildren } from 'react';

export const Card: FunctionComponent<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
    return <div className={classnames('h-fit bg-white/5 shadow rounded-md p-4', className)}>{children}</div>;
};
