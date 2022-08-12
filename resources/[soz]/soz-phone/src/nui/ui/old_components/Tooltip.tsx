import React from 'react';

export const Tooltip: React.FC<any> = ({ children, ...props }) => {
    return <div {...props}>{children}</div>;
};
