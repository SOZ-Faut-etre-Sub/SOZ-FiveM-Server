import clsx from 'clsx';
import { FunctionComponent, HTMLAttributes } from 'react';

import { IconComponentProps } from '../../../system/phone.types';

interface CallButtonProps extends HTMLAttributes<HTMLButtonElement> {
    icon: FunctionComponent<IconComponentProps>;
    label: string;
    onClick?: () => void;
    containerClassName?: string;
    iconClassName?: string;
}

export const CallButton: FunctionComponent<CallButtonProps> = ({
    label,
    icon: Icon,
    containerClassName,
    className,
    iconClassName,
    onClick,
}) => {
    return (
        <div className={clsx('flex flex-col items-center', containerClassName)}>
            <button
                className={clsx('flex justify-center items-center size-20 rounded-full', className, {
                    'bg-white/20': !className,
                })}
                onClick={onClick}
            >
                <Icon className={clsx('size-10', iconClassName)} />
            </button>

            {label}
        </div>
    );
};
