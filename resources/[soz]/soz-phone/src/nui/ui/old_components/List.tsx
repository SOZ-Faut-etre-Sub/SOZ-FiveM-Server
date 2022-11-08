import cn from 'classnames';
import React from 'react';

import { useConfig } from '../../hooks/usePhone';

export const List = ({ ...props }) => {
    const config = useConfig();

    return (
        <div
            className={cn('mx-2 my-4 shadow overflow-y-auto rounded-[.8rem]', {
                'bg-ios-700': config.theme.value === 'dark',
                'bg-white': config.theme.value === 'light',
            })}
        >
            <ul
                className={cn('divide-y', {
                    'divide-[#3D3D3F]': config.theme.value === 'dark',
                    'divide-[#ECECED]': config.theme.value === 'light',
                })}
            >
                {props.children}
            </ul>
        </div>
    );
};
