import { CheckIcon } from '@heroicons/react/outline';
import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import React, { CSSProperties, FunctionComponent, PropsWithChildren, ReactNode, useState } from 'react';

import { useThemeConfig } from '../system/config/config.atom';
import { IconComponentProps } from '../system/phone.types';

export const List = ({ children }) => {
    const theme = useThemeConfig();

    return (
        <div
            className={clsx('mx-2 my-4 shadow overflow-y-auto rounded-xl', {
                'bg-phone-900': theme === 'dark',
                'bg-white': theme === 'light',
            })}
        >
            <ul
                className={clsx('divide-y', {
                    'divide-phone-800': theme === 'dark',
                    'divide-phone-100': theme === 'light',
                })}
            >
                {children}
            </ul>
        </div>
    );
};

export const ListItem = ({ children, ...props }) => {
    const theme = useThemeConfig();

    return (
        <li
            className={clsx(
                'py-2 px-4 flex justify-between items-center text-sm first:rounded-t-xl last:rounded-b-xl',
                {
                    'bg-phone-900 hover:bg-[#27272A] text-white': theme === 'dark',
                    'bg-white hover:bg-gray-50 text-black': theme === 'light',
                    'cursor-pointer': props.onClick,
                }
            )}
            {...props}
        >
            {children}
        </li>
    );
};

interface ListButtonProps extends PropsWithChildren {
    style?: CSSProperties;
    actions: {
        label: string;
        color: string;
        icon: FunctionComponent<IconComponentProps>;
        onClick: () => void;
    }[];
}

export const ListButton: FunctionComponent<ListButtonProps> = ({ children, style, actions }) => {
    const theme = useThemeConfig();
    const [open, setOpen] = useState(false);

    const styles = useSpring({
        from: {
            transform: `translateX(0%)`,
        },
        to: {
            transform: open ? `translateX(-50%)` : `translateX(0%)`,
        },
    });

    return (
        <div
            style={style}
            className="relative justify-between items-center text-sm"
            onClick={() => setOpen(open => !open)}
        >
            <animated.div
                style={styles}
                className={clsx('absolute h-full w-full flex justify-between items-center text-sm z-10', {
                    'bg-phone-900 hover:bg-[#27272A] text-white': theme === 'dark',
                    'bg-white hover:bg-gray-50 text-black': theme === 'light',
                })}
            >
                {children}
            </animated.div>
            <div className="absolute h-full w-full right-0 top-0 flex justify-end items-center px-2 text-sm">
                {actions.map(({ color, label, icon: Icon, onClick }) => (
                    <button
                        className={clsx('flex flex-col justify-center items-center h-full aspect-square', color)}
                        onClick={onClick}
                    >
                        <Icon className="size-8" />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
