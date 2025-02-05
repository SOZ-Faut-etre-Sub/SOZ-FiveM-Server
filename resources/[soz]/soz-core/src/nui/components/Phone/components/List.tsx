import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import React, { CSSProperties, FunctionComponent, LiHTMLAttributes, PropsWithChildren, useState } from 'react';

import { useThemeConfig } from '../system/config/config.atom';
import { IconComponentProps } from '../system/phone.types';

export const List: FunctionComponent<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
    const theme = useThemeConfig();

    return (
        <div
            className={clsx('mx-2 my-4 shadow overflow-y-auto rounded-xl', className, {
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

export const ListItem: FunctionComponent<LiHTMLAttributes<any>> = ({ children, className, ...props }) => {
    const theme = useThemeConfig();

    return (
        <li
            className={clsx(
                'py-2 flex justify-between items-center text-sm first:rounded-t-xl last:rounded-b-xl',
                className,
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
    className?: string;
    style?: CSSProperties;
    actionWidth?: number;
    actions: {
        label: string;
        color: string;
        icon: FunctionComponent<IconComponentProps>;
        onClick: () => void;
        condition?: boolean;
    }[];
}

export const ListButton: FunctionComponent<ListButtonProps> = ({
    children,
    className,
    actionWidth,
    style,
    actions,
}) => {
    const theme = useThemeConfig();
    const [open, setOpen] = useState(false);

    const actionFilter = (action: ListButtonProps['actions'][0]) => {
        if (action.condition === undefined) {
            return true;
        }
        return action.condition;
    };

    const styles = useSpring({
        from: {
            transform: `translateX(0px)`,
        },
        to: {
            transform: open
                ? `translateX(-${Number(actionWidth ?? style.height) * actions.filter(actionFilter).length}px)`
                : `translateX(0px)`,
        },
    });

    return (
        <li
            style={style}
            className="relative justify-between items-center text-sm first:rounded-t-2xl last:rounded-b-2xl overflow-hidden"
            onClick={() => setOpen(open => !open)}
        >
            <animated.div
                style={styles}
                className={clsx('absolute h-full w-full flex justify-between items-center text-sm z-10', className, {
                    'bg-phone-900 hover:bg-[#27272A] text-white': theme === 'dark',
                    'bg-white hover:bg-gray-50 text-black': theme === 'light',
                })}
            >
                {children}
            </animated.div>
            <div className="absolute h-full w-full right-0 top-0 flex justify-end items-center text-xs">
                {actions.filter(actionFilter).map(({ color, label, icon: Icon, onClick }) => (
                    <button
                        className={clsx('flex flex-col justify-center items-center h-full aspect-square p-1', color)}
                        style={{ width: actionWidth ?? style.height }}
                        onClick={onClick}
                    >
                        <Icon className="size-8" />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </li>
    );
};
