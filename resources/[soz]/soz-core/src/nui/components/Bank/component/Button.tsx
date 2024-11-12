import React, { forwardRef, PropsWithChildren } from 'react';

import { useHudColor } from '../../Hud/hooks/useHudColor';

interface ButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    type?: 'button' | 'submit' | 'reset';
}

export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>((props, ref) => {
    const { button } = useHudColor();

    const variant = props.variant ?? 'primary';

    return (
        <button
            ref={ref}
            className="mt-3 w-full p-2 rounded-xl font-semibold"
            style={{
                backgroundColor: button[variant].background,
                color: button[variant].color,
            }}
            {...props}
        >
            {props.children}
        </button>
    );
});
