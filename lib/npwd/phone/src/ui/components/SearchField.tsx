import React from 'react';
import {InputBase, TextField} from './Input';
import {SearchIcon} from "@heroicons/react/outline";

interface SearchFieldProps {
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    value: string;
    placeholder?: string;
}

const DEFAULT_PROPS = {
    onChange: () => {
    },
    value: '',
    placeholder: 'Search...',
};

export const SearchField: React.FC<SearchFieldProps> = ({
    value,
    onChange,
    placeholder,
} = DEFAULT_PROPS) => {
    return (
        <div className="rounded-lg mx-3">
            <div className="bg-[#1C1C1E] flex items-center rounded-lg">
                <SearchIcon className="text-gray-500 ml-2 w-5 h-5" />
                <TextField
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="bg-[#1C1C1E]"
                    inputProps={{'aria-label': 'search'}}
                />
            </div>
        </div>
    );
};
