import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import classnames from 'classnames';
import React, { forwardRef, FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react';

import { useOutside } from '../../hook/outside';
import { useHudColor } from '../Hud/hooks/useHudColor';
import { GlassMorphismContainer } from './GlassMorphismContainer';

interface ApplicationContainerProps {
    size: 'full' | 'large' | 'small' | 'custom';
    onClickOutside?: () => void;
    className?: string;
}

export const ApplicationContainer: FunctionComponent<PropsWithChildren<ApplicationContainerProps>> = ({
    children,
    className,
    size,
    onClickOutside,
}) => {
    const { color } = useHudColor();

    const backgroundStyles = useSpring({
        from: { opacity: 0 },
        to: { opacity: 0.99999 }, // prevent black background when doing backdrop-blur
    });

    const contentStyles = useSpring({
        from: { y: 50, opacity: 0 },
        to: { y: 0, opacity: 0.99999, color }, // prevent black background when doing backdrop-blur
    });

    const refOutside = useOutside({
        down: event => {
            if (!onClickOutside) return;

            let el = event.target as HTMLElement;
            while (el.parentNode) {
                el = el.parentNode as HTMLElement;
                if (el.getAttribute && el.getAttribute('data-ignore-click-outside')) return;
            }

            onClickOutside();
        },
    });

    return (
        <>
            <div className="absolute font-prompt flex justify-center items-center h-full w-full z-10 overflow-hidden">
                <animated.div
                    ref={refOutside}
                    style={contentStyles}
                    className={cn('h-full w-full mx-auto my-auto', className, {
                        'max-h-[850px] max-w-[1536px]': size === 'full',
                        'max-h-[450px] max-w-[700px]': size === 'large',
                        'max-h-[800px] max-w-[536px]': size === 'small',
                    })}
                >
                    {children}
                </animated.div>
                <animated.div style={backgroundStyles} className="absolute bg-black/35 h-full w-full -z-10" />
            </div>
        </>
    );
};

interface ApplicationContentProps extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
}

export const ApplicationContent: FunctionComponent<PropsWithChildren<ApplicationContentProps>> = ({
    children,
    className,
    open = false,
}) => {
    const [styles] = useSpring(
        () => ({
            from: {
                opacity: 0,
                transform: 'translateY(100vh)',
            },
            to: {
                opacity: 1,
                transform: open ? 'translateY(0)' : 'translateY(100vh)',
            },
        }),
        [open]
    );

    return (
        <animated.div style={styles} className="flex h-full w-full overflow-hidden shadow-2xl">
            <GlassMorphismContainer
                borderClassName="rounded-3xl"
                className={classnames('flex gap-10 h-full w-full p-10', className)}
            >
                {children}
            </GlassMorphismContainer>
        </animated.div>
    );
};

interface ApplicationCheckboxProps extends HTMLAttributes<HTMLInputElement> {
    checked: boolean;
    onChange: () => void;
}

export const ApplicationCheckbox: FunctionComponent<ApplicationCheckboxProps> = ({ checked, onChange }) => {
    return (
        <div
            className="relative flex justify-center items-center size-4 rounded-full ring-2 ring-offset-0 ring-white aspect-square cursor-pointer"
            onClick={onChange}
        >
            {checked && <div className="absolute size-3 bg-white rounded-full" />}
        </div>
    );
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const ApplicationCard: FunctionComponent<PropsWithChildren<CardProps>> = ({ children, style, className }) => {
    const { card } = useHudColor();

    return (
        <div
            style={{
                ...style,
                backgroundColor: card,
            }}
            className={classnames('py-4 px-5 shadow-sm rounded-xl backdrop-blur-xl', className)}
        >
            {children}
        </div>
    );
};

interface ButtonProps {
    onClick?: () => void;
    btnClassName?: string;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export const ApplicationButton = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>((props, ref) => {
    const { button } = useHudColor();

    const variant = props.variant ?? 'primary';

    return (
        <button
            ref={ref}
            className={cn('py-2 px-3 rounded-xl font-semibold', props.btnClassName, {
                'w-full': props.fullWidth,
                'opacity-50 cursor-not-allowed': props.disabled,
            })}
            style={{
                backgroundColor: button[variant].background,
                color: button[variant].color,
            }}
            {...props}
        >
            {props.children}
        </button>
    );
});
