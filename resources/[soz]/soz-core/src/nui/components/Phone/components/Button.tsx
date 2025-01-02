import React, { forwardRef, FunctionComponent } from 'react';

export const Button: FunctionComponent<any> = forwardRef(({ children, ...props }, ref) => {
    return (
        <button ref={ref} aria-label="button" {...props}>
            {children}
        </button>
    );
});
