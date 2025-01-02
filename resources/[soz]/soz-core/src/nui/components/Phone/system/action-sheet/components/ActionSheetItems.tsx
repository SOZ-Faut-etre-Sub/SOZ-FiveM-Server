import clsx from 'clsx';
import React, { FunctionComponent, HTMLAttributes } from 'react';

interface ActionSheetItemProps extends HTMLAttributes<HTMLLIElement> {
    selected?: boolean;
    bold?: boolean;
}

export const ActionSheetTitle: FunctionComponent<ActionSheetItemProps> = ({ children }) => {
    return (
        <li className={clsx('flex justify-center items-center font-semibold text-sm h-[56px] text-gray-300')}>
            {children}
        </li>
    );
};

export const ActionSheetItem: FunctionComponent<ActionSheetItemProps> = ({ children, selected, bold, ...props }) => {
    return (
        <li
            className={clsx(
                'flex justify-center items-center text-[#007AFF] text-sm h-[56px] hover:bg-ios-700 hover:bg-opacity-50 first:rounded-t-2xl last:rounded-b-2xl',
                {
                    'cursor-pointer': props.onClick,
                    'font-semibold': bold,
                    'text-red-500': selected,
                }
            )}
            {...props}
        >
            {children}
        </li>
    );
};
