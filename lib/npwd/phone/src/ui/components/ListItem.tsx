import React from 'react';

export const ListItem = ({ ...props }) => (
  <li className={`${props.onClick && 'cursor-pointer'} py-2 px-4 flex justify-between items-center hover:bg-[#27272A] text-white text-sm`} {...props}>
    {props.children}
  </li>
);
