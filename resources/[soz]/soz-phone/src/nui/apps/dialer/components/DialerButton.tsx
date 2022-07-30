import React, { memo, useContext } from 'react';

import { ThemeContext } from '../../../styles/themeProvider';

interface ButtonItemProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    label: string | JSX.Element | number;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const DialerButton: React.FC<ButtonItemProps> = memo(({ label, type, onClick, className }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <button
            type={type}
            className={`flex justify-center items-center w-20 aspect-square m-2 ${
                theme === 'dark' ? 'bg-[#333333] hover:bg-[#444444]' : 'bg-white hover:bg-[#E5E5E5] text-gray-700'
            } rounded-full cursor-pointer ${className}`}
            onClick={onClick}
        >
            <span className="text-3xl">{label}</span>
        </button>
    );
});
