import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

import { useThemeConfig } from '../system/config/config.atom';

type Props = {
    picture?: string;
    useOffset?: boolean;
    size?: 'small' | 'medium' | 'large';
};

export const ContactPicture: FunctionComponent<Props> = ({ picture, useOffset = true, size = 'small' }) => {
    const theme = useThemeConfig();

    return (
        <div
            className={clsx('bg-cover bg-center my-1 rounded-full', {
                'bg-ios-700': theme === 'dark',
                'bg-gray-300': theme === 'light',
                'h-10 w-10': size === 'small',
                'h-14 w-14': size === 'medium',
                'h-20 w-20': size === 'large',
            })}
            style={{ backgroundImage: `url(${picture})`, backgroundPosition: useOffset ? '-300px 0' : undefined }}
        />
    );
};
