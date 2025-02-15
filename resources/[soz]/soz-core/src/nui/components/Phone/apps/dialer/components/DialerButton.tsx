import clsx from 'clsx';
import React, { FunctionComponent, memo, MouseEventHandler } from 'react';

import { useThemeConfig } from '../../../system/config/config.atom';

interface ButtonItemProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    label: string | JSX.Element | number;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const DialerButton: FunctionComponent<ButtonItemProps> = memo(({ label, type, onClick, className }) => {
    const theme = useThemeConfig();

    return (
        <button
            type={type}
            className={clsx(
                'flex justify-center items-center w-20 aspect-square m-2 rounded-full cursor-pointer',
                className,
                {
                    'bg-ios-700 hover:bg-ios-600': !className && theme === 'dark',
                    'bg-white hover:bg-[#E5E5E5] text-gray-700': !className && theme === 'light',
                }
            )}
            onClick={onClick}
        >
            <span className="text-3xl">{label}</span>
        </button>
    );
});
