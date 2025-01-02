import clsx from 'clsx';
import React from 'react';

import { useThemeConfig } from '../system/config/config.atom';

export const List = ({ children }) => {
    const theme = useThemeConfig();

    return (
        <div
            className={clsx('mx-2 my-4 shadow overflow-y-auto rounded-xl', {
                'bg-phone-900': theme === 'dark',
                'bg-white': theme === 'light',
            })}
        >
            <ul
                className={clsx('divide-y', {
                    'divide-phone-800': theme === 'dark',
                    'divide-phone-100': theme === 'light',
                })}
            >
                {children}
            </ul>
        </div>
    );
};

export const ListItem = ({ children, ...props }) => {
    const theme = useThemeConfig();

    return (
        <li
            className={clsx(
                'py-2 px-4 flex justify-between items-center text-sm first:rounded-t-xl last:rounded-b-xl',
                {
                    'bg-phone-900 hover:bg-[#27272A] text-white': theme === 'dark',
                    'bg-white hover:bg-gray-50 text-black': theme === 'light',
                    'cursor-pointer': props.onClick,
                }
            )}
            {...props}
        >
            {children}
        </li>
    );
};
