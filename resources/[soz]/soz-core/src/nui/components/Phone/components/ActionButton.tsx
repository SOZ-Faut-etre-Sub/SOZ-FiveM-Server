import clsx from 'clsx';
import React from 'react';

import { useThemeConfig } from '../system/config/config.atom';

export const ActionButton: React.FC<any> = ({ children, ...props }) => {
    const theme = useThemeConfig();

    return (
        <button
            {...props}
            className={clsx(props.className, 'flex flex-col justify-center items-center rounded-xl p-3 w-full', {
                'bg-ios-700 text-[#347DD9]': theme === 'dark',
                'bg-white text-gray-700': theme === 'light',
                'bg-opacity-50 cursor-not-allowed': props.disabled,
            })}
        >
            {children}
        </button>
    );
};
