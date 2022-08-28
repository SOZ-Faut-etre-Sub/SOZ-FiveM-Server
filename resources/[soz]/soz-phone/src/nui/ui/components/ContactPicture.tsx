import cn from 'classnames';
import React, { FunctionComponent } from 'react';

import { useConfig } from '../../hooks/usePhone';

type Props = {
    picture?: string;
    useOffset?: boolean;
    size?: 'small' | 'large';
};

export const ContactPicture: FunctionComponent<Props> = ({ picture, useOffset = true, size = 'small' }) => {
    const config = useConfig();

    return (
        <div
            className={cn('bg-cover bg-center my-1 rounded-full', {
                'bg-gray-700': config.theme.value === 'dark',
                'bg-gray-300': config.theme.value === 'light',
                'h-10 w-10': size === 'small',
                'h-20 w-20': size === 'large',
            })}
            style={{ backgroundImage: `url(${picture})`, backgroundPosition: useOffset ? '-300px 0' : undefined }}
        />
    );
};
