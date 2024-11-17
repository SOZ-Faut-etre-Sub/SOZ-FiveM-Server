import cn from 'classnames';
import { FunctionComponent, PropsWithChildren } from 'react';

interface TitleProps {
    size: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    uppercase?: boolean;
    className?: string;
}

export const Title: FunctionComponent<PropsWithChildren<TitleProps>> = ({
    size,
    uppercase = true,
    className,
    children,
}) => {
    return (
        <h2
            className={cn('font-semibold', className, {
                'text-sm': size === 'xxsmall',
                'text-base': size === 'xsmall',
                'text-lg': size === 'small',
                'text-2xl': size === 'medium',
                'text-3xl': size === 'large',
                'text-4xl': size === 'xlarge',

                uppercase: uppercase,
            })}
        >
            {children}
        </h2>
    );
};
