import React, {useContext} from 'react';
import {ThemeContext} from "../../styles/themeProvider";

export const ListItem = ({ ...props }) => {
    const {theme} = useContext(ThemeContext);

    return (
        <li className={`${props.onClick && 'cursor-pointer'} py-2 px-4 flex justify-between items-center ${theme === 'dark' ? 'hover:bg-[#27272A] text-white' : 'hover:bg-gray-50 text-black'} text-sm`} {...props}>
            {props.children}
        </li>
    )
};
