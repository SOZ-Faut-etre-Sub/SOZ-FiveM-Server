import cn from 'classnames';
import React, { memo } from 'react';

import { useConfig } from '../../../hooks/usePhone';

interface ButtonItemProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    label: string | JSX.Element | number;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const DialerButton: React.FC<ButtonItemProps> = memo(({ label, type, onClick, className }) => {
    const config = useConfig();

    return (
        <button
            type={type}
            className={cn(
                'flex justify-center items-center w-20 aspect-square m-2 rounded-full cursor-pointer',
                className,
                {
                    'bg-ios-700 hover:bg-ios-600': config.theme.value === 'dark',
                    'bg-white hover:bg-[#E5E5E5] text-gray-700': config.theme.value === 'light',
                }
            )}
            onClick={onClick}
        >
            <span className="text-3xl">{label}</span>
        </button>
    );
});
