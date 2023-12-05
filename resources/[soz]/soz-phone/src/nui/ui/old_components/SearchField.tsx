import { SearchIcon } from '@heroicons/react/outline';
import cn from 'classnames';
import React from 'react';

import { useConfig } from '../../hooks/usePhone';
import { TextField } from './Input';

interface SearchFieldProps {
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    value: string;
    placeholder?: string;
}

const DEFAULT_PROPS = {
    onChange: () => {},
    value: '',
    placeholder: 'Search...',
};

export const SearchField: React.FC<SearchFieldProps> = ({ value, onChange, placeholder } = DEFAULT_PROPS) => {
    const config = useConfig();

    return (
        <div className="rounded-lg mx-3 py-2">
            <div
                className={cn('flex items-center rounded-lg', {
                    'bg-ios-700': config.theme.value === 'dark',
                    'bg-gray-300': config.theme.value === 'light',
                })}
            >
                <SearchIcon className="text-gray-500 ml-2 w-5 h-5" />
                <TextField
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={cn({
                        'bg-ios-700': config.theme.value === 'dark',
                        'bg-gray-300': config.theme.value === 'light',
                    })}
                />
            </div>
        </div>
    );
};
