import cn from 'classnames';
import React, { FunctionComponent } from 'react';

export const AppContent: FunctionComponent<any> = ({ children, className }) => {
    return <div className={cn('h-[755px] w-full px-2 pb-16', className)}>{children}</div>;
};
