import React, {useContext} from 'react';
import {ThemeContext} from "../../styles/themeProvider";
import cn from 'classnames';

export const ActionButton: React.FC<any> = ({ ...props }) => {
    const {theme} = useContext(ThemeContext);

    return (
        <div {...props} className={cn('flex flex-col justify-center items-center rounded-xl p-3', {
            'bg-[#1C1C1E] text-[#347DD9]': theme === 'dark',
            'bg-white text-gray-700': theme === 'light',
            'bg-opacity-50 cursor-not-allowed': props.disabled,
            'cursor-pointer': !props.disabled,
        })}>
            {props.children}
        </div>
    )
};
