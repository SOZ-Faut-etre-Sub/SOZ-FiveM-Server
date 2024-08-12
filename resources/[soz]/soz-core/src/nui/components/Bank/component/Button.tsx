import React, { forwardRef, PropsWithChildren } from 'react';

interface ButtonProps {
    onClick?: () => void;
}

export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>((props, ref) => {
    return (
        <button
            ref={ref}
            className="bg-teal-400/10 hover:bg-teal-500/10 ring-1 ring-inset ring-teal-400/10 hover:ring-teal-500/10 mt-3 w-full p-2 rounded-md"
            {...props}
        >
            {props.children}
        </button>
    );
});
