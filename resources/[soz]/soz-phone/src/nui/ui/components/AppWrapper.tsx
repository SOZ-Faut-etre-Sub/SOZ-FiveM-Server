import React, { FunctionComponent } from 'react';

export const AppWrapper: FunctionComponent<any> = ({ children, className }) => {
    return <div className={className}>{children}</div>;
};
