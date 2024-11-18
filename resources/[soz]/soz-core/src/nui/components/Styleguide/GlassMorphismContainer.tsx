import cn from 'classnames';
import { FunctionComponent, HTMLAttributes, PropsWithChildren, useMemo, useRef } from 'react';

import { useHudColor } from '../Hud/hooks/useHudColor';
import { GameCanvasBox } from './GameCanvasBox';

interface GlassMorphismContainerProps extends HTMLAttributes<any>, PropsWithChildren {
    borderColor?: string;
    borderClassName?: string;
    disableBorder?: boolean;
    showBorderOnHover?: boolean;
    disableGameClone?: boolean;
    blur?: boolean;
    rounded?: number;
    circle?: boolean;
    duration?: string;
}

export const GlassMorphismContainer: FunctionComponent<GlassMorphismContainerProps> = ({
    className,
    style,
    borderColor,
    borderClassName,
    disableBorder,
    showBorderOnHover,
    disableGameClone,
    children,
    blur = true,
    rounded,
    circle,
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
        <div className={cn('relative bg-opacity-10 h-full w-full overflow-hidden group z-10', borderClassName)}>
            <GameCanvasBox
                borderClassName={borderClassName}
                disableGameClone={disableGameClone}
                rounded={rounded}
                blur={blur}
                circle={circle}
            >
                <div
                    className={cn(
                        'absolute h-full w-full transition-opacity border-transparent z-10',
                        borderClassName,
                        duration,
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

                <div ref={childrenRef} className={cn('relative z-10', className)} style={style}>
                    {children}
                </div>

                <div
                    className="absolute inset-0 transition-all duration-1000"
                    style={{
                        background: glassmorphismColors.background,
                    }}
                />
            </GameCanvasBox>
        </div>
    );
};
