import clsx from 'clsx';
import React, { FunctionComponent, PropsWithChildren } from 'react';

import { useThemeConfig } from '../../config/config.atom';

type ActionSheetContainerProps = PropsWithChildren;

export const ActionSheetContainer: FunctionComponent<ActionSheetContainerProps> = ({ children }) => {
    const theme = useThemeConfig();

    return (
        <ul
            className={clsx('divide-y rounded-2xl shadow-2xl', {
                'bg-phone-300/90 divide-phone-500/30': theme === 'light',
                'bg-phone-900/90 divide-phone-800/30': theme === 'dark',
            })}
        >
            {children}
        </ul>
    );
};
