import cn from 'classnames';
import React from 'react';

import { useConfig } from '../../hooks/usePhone';

export const ListItem = ({ ...props }) => {
    const config = useConfig();

    return (
        <li
            className={cn('py-2 px-4 flex justify-between items-center text-sm', {
                'hover:bg-[#27272A] text-white': config.theme.value === 'dark',
                'hover:bg-gray-50 text-black': config.theme.value === 'light',
                'cursor-pointer': props.onClick,
            })}
            {...props}
        >
            {props.children}
        </li>
    );
};
