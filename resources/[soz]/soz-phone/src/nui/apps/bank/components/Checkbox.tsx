import cn from 'classnames';
import React, { memo } from 'react';

import { useConfig } from '../../../hooks/usePhone';

type Props = {
    title: string;
    enabled: boolean;
};

export const Checkbox = memo(({ title, enabled }: Props) => {
    const config = useConfig();

    return (
        <div className="flex justify-between items-center py-2">
            <span
                className={cn('text-sm font-medium ', {
                    'text-gray-100': config.theme.value === 'dark',
                    'text-gray-900': config.theme.value === 'light',
                })}
            >
                {title}
            </span>
            <button
                className={cn(
                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200',
                    {
                        'bg-indigo-600': enabled,
                        'bg-ios-700': !enabled && config.theme.value === 'dark',
                        'bg-gray-300': !enabled && config.theme.value === 'light',
                    }
                )}
            >
                <span
                    className={cn(
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
});
