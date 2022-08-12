import cn from 'classnames';
import React from 'react';

import { useConfig } from '../../hooks/usePhone';

export const ActionButton: React.FC<any> = ({ ...props }) => {
    const config = useConfig();

    return (
        <div
            {...props}
            className={cn('flex flex-col justify-center items-center rounded-xl p-3', {
                'bg-[#1C1C1E] text-[#347DD9]': config.theme.value === 'dark',
                'bg-white text-gray-700': config.theme.value === 'light',
                'bg-opacity-50 cursor-not-allowed': props.disabled,
                'cursor-pointer': !props.disabled,
            })}
        >
            {props.children}
        </div>
    );
};
