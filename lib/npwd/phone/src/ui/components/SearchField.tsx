import React, {useContext} from 'react';
import {TextField} from './Input';
import {SearchIcon} from "@heroicons/react/outline";
import {ThemeContext} from "../../styles/themeProvider";

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
    const {theme} = useContext(ThemeContext);

    return (
        <div className="rounded-lg mx-3">
            <div className={`${theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-gray-300'} flex items-center rounded-lg`}>
                <SearchIcon className="text-gray-500 ml-2 w-5 h-5" />
                <TextField
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-gray-300'}
                    inputProps={{'aria-label': 'search'}}
                />
            </div>
        </div>
    );
};
