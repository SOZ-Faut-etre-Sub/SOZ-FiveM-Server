import React, {useContext} from 'react';
import {ThemeContext} from "../../styles/themeProvider";

export const ActionButton: React.FC<any> = ({ ...props }) => {
    const {theme} = useContext(ThemeContext);

    return (
        <div className={`flex flex-col justify-center items-center ${theme === 'dark' ? 'bg-[#1C1C1E] text-[#347DD9]': 'bg-white text-gray-700'} rounded-xl p-3 cursor-pointer`} {...props}>
            {props.children}
        </div>
    )
};
