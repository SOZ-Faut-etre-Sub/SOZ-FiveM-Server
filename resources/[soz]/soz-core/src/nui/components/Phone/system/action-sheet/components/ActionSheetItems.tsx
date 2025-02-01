import clsx from 'clsx';
import React, { FunctionComponent, HTMLAttributes } from 'react';

interface ActionSheetItemProps extends HTMLAttributes<HTMLLIElement> {
    selected?: boolean;
    bold?: boolean;
}

export const ActionSheetTitle: FunctionComponent<ActionSheetItemProps> = ({ children }) => {
    return (
        <li className={clsx('flex justify-center items-center font-semibold text-sm min-h-[56px] py-6 text-phone-500')}>
            {children}
        </li>
    );
};

export const ActionSheetItem: FunctionComponent<ActionSheetItemProps> = ({ children, selected, bold, ...props }) => {
    return (
        <li
            className={clsx(
                'flex justify-center items-center text-[#007AFF] h-[56px] hover:bg-phone-600/30 first:rounded-t-2xl last:rounded-b-2xl',
                {
                    'cursor-pointer': props.onClick,
                    'font-semibold': bold,
                    'font-semibold bg-phone-600/30': selected,
                }
            )}
            {...props}
        >
            {children}
        </li>
    );
};
