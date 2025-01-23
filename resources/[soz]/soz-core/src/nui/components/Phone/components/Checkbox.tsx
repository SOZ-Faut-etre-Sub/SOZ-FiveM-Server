import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

import { useThemeConfig } from '../system/config/config.atom';

type Props = {
    title: string;
    enabled: boolean;
    onClick?: (value: boolean) => void;
};

export const Checkbox: FunctionComponent<Props> = ({ title, enabled, onClick }) => {
    const theme = useThemeConfig();

    return (
        <div className="flex justify-between items-center py-2" onClick={() => onClick(!enabled)}>
            <span
                className={clsx('text-sm font-medium ', {
                    'text-gray-100': theme === 'dark',
                    'text-gray-900': theme === 'light',
                })}
            >
                {title}
            </span>
            <button
                className={clsx(
                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200',
                    {
                        'bg-indigo-600': enabled,
                        'bg-ios-700': !enabled && theme === 'dark',
                        'bg-gray-300': !enabled && theme === 'light',
                    }
                )}
            >
                <span
                    className={clsx(
                        'pointer-events-none inline-block self-center h-4 w-4 rounded-full bg-white shadow transform transition ease-in-out duration-200',
                        {
                            'translate-x-5': enabled,
                            'translate-x-1': !enabled,
                        }
                    )}
                />
            </button>
        </div>
    );
};
