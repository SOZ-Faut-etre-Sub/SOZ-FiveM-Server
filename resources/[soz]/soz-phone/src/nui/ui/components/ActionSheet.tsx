import cn from 'classnames';
import React, { FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react';

type ActionSheetContainerProps = PropsWithChildren;

export const ActionSheetContainer: FunctionComponent<ActionSheetContainerProps> = ({ children }) => {
    return <ul className="bg-ios-600 bg-opacity-95 rounded-2xl">{children}</ul>;
};

interface ActionSheetItemProps extends HTMLAttributes<HTMLLIElement> {
    selected?: boolean;
    bold?: boolean;
}

export const ActionSheetTitle: FunctionComponent<ActionSheetItemProps> = ({ children }) => {
    return (
        <li className={cn('flex justify-center items-center font-semibold text-sm h-[56px] text-gray-300')}>
            {children}
        </li>
    );
};

export const ActionSheetItem: FunctionComponent<ActionSheetItemProps> = ({ children, ...props }) => {
    const a = '#4a4a4a';
    return (
        <li
            className={cn(
                'flex justify-center items-center text-[#007AFF] text-sm h-[56px] hover:bg-ios-700 hover:bg-opacity-50 text-white first:rounded-t-2xl last:rounded-b-2xl',
                {
                    'cursor-pointer': props.onClick,
                    'font-semibold': props.bold,
                    'text-red-500': props.selected,
                }
            )}
            {...props}
        >
            {children}
        </li>
    );
};
