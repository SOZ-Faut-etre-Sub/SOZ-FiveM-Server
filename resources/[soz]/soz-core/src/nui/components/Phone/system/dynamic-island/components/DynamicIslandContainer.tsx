import { animated, AnimatedProps } from '@react-spring/web';
import clsx from 'clsx';
import { ComponentPropsWithRef, FunctionComponent, PropsWithChildren } from 'react';

interface DynamicIslandContainerProps extends AnimatedProps<PropsWithChildren<ComponentPropsWithRef<'div'>>> {
    rounded?: string;
}

export const DynamicIslandContainer: FunctionComponent<DynamicIslandContainerProps> = ({
    rounded = 'rounded-full',
    children,
    ...props
}) => {
    return (
        <animated.div
            className={clsx(
                'absolute top-4 flex items-center gap-3 grow min-w-0 py-3 px-4 bg-black cursor-pointer z-[200] overflow-hidden',
                rounded
            )}
            {...props}
        >
            {children}
        </animated.div>
    );
};
