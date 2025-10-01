import { ButtonHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const CategoryButton = forwardRef<HTMLButtonElement, Props>((props, ref) => (
    <button
        ref={ref}
        onClick={props.onClick}
        className={twMerge(
            'flex items-center justify-center aspect-square bg-gradient-to-tr from-white/40 to-white/20 border border-white/20 rounded-lg p-4 text-white transition-all duration-200 disabled:opacity-80 hover:scale-105 hover:shadow-xl',
            props.className
        )}
        title={props.title}
    >
        {props.children}
    </button>
));
