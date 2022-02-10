import React, {useContext} from 'react';
import {ThemeContext} from "../../styles/themeProvider";

export const List = ({ ...props }) => {
    const {theme} = useContext(ThemeContext);

    return (
        <div className={`mx-2 my-4 ${theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-white'} shadow overflow-hidden rounded-[.8rem]`}>
            <ul className={`divide-y ${theme === 'dark' ? 'divide-[#3D3D3F]' : 'divide-[#ECECED]'}`}>
                {props.children}
            </ul>
        </div>
    )
};
