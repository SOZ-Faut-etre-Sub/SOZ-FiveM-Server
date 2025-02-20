import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

import { useThemeConfig } from '../system/config/config.atom';

type Props = {
    picture?: string;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
};

const FALLBACK_IMAGE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';

export const ContactPicture: FunctionComponent<Props> = ({ picture, size = 'small' }) => {
    const theme = useThemeConfig();

    return (
        <img
            className={clsx('bg-cover bg-center my-1 rounded-full shrink-0', {
                'bg-ios-700': theme === 'dark',
                'bg-gray-300': theme === 'light',
                'size-10': size === 'small',
                'size-14': size === 'medium',
                'size-20': size === 'large',
                'size-28': size === 'xlarge',
            })}
            onError={e => (e.currentTarget.src = FALLBACK_IMAGE)}
            src={picture ?? FALLBACK_IMAGE}
            alt={picture}
            loading="lazy"
        />
    );
};
