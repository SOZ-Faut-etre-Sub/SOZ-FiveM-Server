import cn from 'classnames';
import { FunctionComponent, PropsWithChildren, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';
import { useHudColor } from '../Hud/hooks/useHudColor';

type BorderBoxProps = {
    borderColor?: string;
    borderClassName?: string;
    disableBorder?: boolean;
    showBorder?: boolean;
    showBorderOnHover?: boolean;
    blur?: boolean;
    duration?: string;
    useCardColor?: boolean;
    disableBackground?: boolean;
};

export const BorderBox: FunctionComponent<PropsWithChildren<BorderBoxProps>> = ({
    borderColor,
    borderClassName,
    disableBorder,
    showBorder,
    showBorderOnHover,
    children,
    blur = true,
    duration = 'duration-1000',
    useCardColor = false,
    disableBackground = false,
}) => {
    const glassmorphism = useSelector((state: RootState) => state.hud.useGlassmorphism);

    const { glassmorphismColors, card } = useHudColor();
    const childrenRef = useRef<HTMLDivElement>(null);

    const { height } = childrenRef.current?.getBoundingClientRect() || { height: '100%' };

    const currentBorderColor = useMemo(() => {
        if (borderColor) {
            return borderColor;
        }

        return glassmorphismColors.border;
    }, [glassmorphismColors, borderColor]);

    return (
        <div
            className={cn('relative bg-opacity-10 h-full w-full overflow-hidden group z-10', borderClassName, {
                'backdrop-blur-[5px]': glassmorphism && blur,
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
                        'border-2': !disableBorder || showBorder || showBorderOnHover,
                        'opacity-0': !showBorder,
                        'opacity-100': showBorder,
                        'opacity-0 group-hover:opacity-100': showBorderOnHover && !showBorder,
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

            <div ref={childrenRef} className="relative z-10">
                {children}
            </div>

            {!disableBackground && (
                <div
                    className="absolute inset-0 transition-all duration-1000"
                    style={{
                        background: useCardColor ? card : glassmorphismColors.background,
                    }}
                />
            )}
        </div>
    );
};
