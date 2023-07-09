import React, { forwardRef } from 'react';

export const Button: React.FC<any> = forwardRef(({ children, ...props }, ref) => {
    return (
        <button ref={ref} aria-label="button" {...props}>
            {children}
        </button>
    );
});
