import { SearchIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

import { useThemeConfig } from '../system/config/config.atom';
import { TextField } from './Input';

interface SearchFieldProps {
    value: string;
    placeholder?: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

export const SearchField: FunctionComponent<SearchFieldProps> = ({
    value,
    onChange,
    placeholder = 'Rechercher...',
}) => {
    const theme = useThemeConfig();

    return (
        <div className="rounded-lg py-2">
            <div
                className={clsx('flex items-center rounded-lg', {
                    'bg-ios-700': theme === 'dark',
                    'bg-gray-300': theme === 'light',
                })}
            >
                <SearchIcon className="text-gray-500 ml-2 w-5 h-5" />
                <TextField
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={clsx({
                        'bg-ios-700': theme === 'dark',
                        'bg-gray-300': theme === 'light',
                    })}
                />
            </div>
        </div>
    );
};
