import cn from 'classnames';
import React, { memo, useContext } from 'react';

import { ThemeContext } from '../../../styles/themeProvider';

type Props = {
    title: string;
    enabled: boolean;
};

export const Checkbox = memo(({ title, enabled }: Props) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className="flex justify-between items-center py-2">
            <span
                className={cn('text-sm font-medium ', {
                    'text-gray-100': theme === 'dark',
                    'text-gray-900': theme === 'light',
                })}
            >
                {title}
            </span>
            <button
                className={cn(
                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200',
                    {
                        'bg-indigo-600': enabled,
                        'bg-gray-700': !enabled && theme === 'dark',
                        'bg-gray-300': !enabled && theme === 'light',
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
