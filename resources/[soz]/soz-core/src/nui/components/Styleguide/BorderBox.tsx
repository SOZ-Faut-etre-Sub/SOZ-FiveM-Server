import cn from 'classnames';
import { FunctionComponent, PropsWithChildren, useMemo, useRef } from 'react';

import { useHudColor } from '../Hud/hooks/useHudColor';

type BorderBoxProps = {
    borderColor?: string;
    borderClassName?: string;
    disableBorder?: boolean;
    showBorderOnHover?: boolean;
    blur?: boolean;
    duration?: string;
};

export const BorderBox: FunctionComponent<PropsWithChildren<BorderBoxProps>> = ({
    borderColor,
    borderClassName,
    disableBorder,
    showBorderOnHover,
    children,
    blur = true,
    duration = 'duration-1000',
}) => {
    const { glassmorphismColors } = useHudColor();
    const childrenRef = useRef<HTMLDivElement>(null);

    const { height } = childrenRef.current?.getBoundingClientRect() || { height: undefined };

    const currentBorderColor = useMemo(() => {
        if (borderColor) {
            return borderColor;
        }

        return glassmorphismColors.border;
    }, [glassmorphismColors, borderColor]);

    return (
        <div
            className={cn('relative bg-opacity-10 h-full w-full overflow-hidden group z-10', borderClassName, {
                'backdrop-blur-[5px]': blur,
            })}
            style={{
                opacity: 0.99,
            }}
        >
            <div
                className={cn(
                    'absolute h-full w-full transition-opacity border-transparent z-10',
                    duration,
                    borderClassName,
                    {
                        'border-2': !disableBorder || showBorderOnHover,
                        'opacity-0 group-hover:opacity-100': showBorderOnHover,
                    }
                )}
                style={{
                    height,
                    background: `linear-gradient(-40deg, ${currentBorderColor}FC 0%, ${currentBorderColor}1A 25%, ${currentBorderColor}1A 75%, ${currentBorderColor}FC 100%) border-box`,
                    WebkitMask: `linear-gradient(${currentBorderColor} 0 0) padding-box, linear-gradient(${currentBorderColor} 0 0) border-box`,
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />

            <div ref={childrenRef} className={cn('relative z-10')}>
                {children}
            </div>

            <div
                className="absolute inset-0 transition-all duration-1000"
                style={{
                    background: glassmorphismColors.background,
                }}
            />
        </div>
    );
};
