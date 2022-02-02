import React from 'react';
import {InputBase} from './Input';

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
        <div >
            <div >
                <div >
                    {/*<SearchIcon/>*/}
                </div>
                <InputBase
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    inputProps={{'aria-label': 'search'}}
                />
            </div>
        </div>
    );
};
