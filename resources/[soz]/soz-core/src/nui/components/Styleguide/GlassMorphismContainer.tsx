import cn from 'classnames';
import { FunctionComponent, HTMLAttributes, PropsWithChildren, useEffect, useMemo, useRef } from 'react';

import { useHudTheme } from '../../hook/data';
import { useDaltonism } from '../Hud/hooks/useDaltonism';

interface GlassMorphismContainerProps extends HTMLAttributes<any>, PropsWithChildren {
    borderColor?: string;
    borderClassName?: string;
    disableBorder?: boolean;
    showBorderOnHover?: boolean;
}

export const GlassMorphismContainer: FunctionComponent<GlassMorphismContainerProps> = ({
    className,
    style,
    borderColor,
    borderClassName,
    disableBorder,
    showBorderOnHover,
    children,
}) => {
    const currentTheme = useHudTheme();
    const { glassmorphismColors } = useDaltonism();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<HTMLDivElement>(null);

    const { height } = childrenRef.current?.getBoundingClientRect() || { height: undefined };

    const currentBorderColor = useMemo(() => {
        if (borderColor) {
            return borderColor;
        }

        return glassmorphismColors[currentTheme].border;
    }, [glassmorphismColors, currentTheme, borderColor]);

    useEffect(() => {
        let animation = null;
        const renderLoop = () => {
            try {
                const container = containerRef.current.getBoundingClientRect();

                const canvas = window.parent.document.body.getElementsByTagName('canvas')[0];
                const tCtx = canvasRef.current.getContext('2d');

                canvasRef.current.width = container.width;
                canvasRef.current.height = container.height;
                tCtx.filter = `blur(5px)`;

                if (!canvas) return;

                const context = canvas.getContext('2d');
                context?.fillRect(0, 0, canvas.width, canvas.height);

                tCtx.drawImage(canvas, -container.x, -container.y);

                animation = requestAnimationFrame(renderLoop);
            } catch (e) {
                // ignore error
            }
        };

        renderLoop();
        return () => cancelAnimationFrame(animation);
    }, []);

    return (
        <div
            className={cn('relative bg-opacity-10 h-full w-full overflow-hidden group z-10', borderClassName)}
            style={{
                opacity: 0.99,
            }}
        >
            <div ref={containerRef} className={cn('absolute h-full w-full overflow-hidden', borderClassName)} />

            <div
                className={cn(
                    'absolute h-full w-full transition-opacity duration-1000 border-transparent z-10',
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

            <div ref={childrenRef} className={cn('relative z-10', className)} style={style}>
                {children}
            </div>

            <div
                className="absolute inset-0 transition-all duration-1000"
                style={{
                    background: glassmorphismColors[currentTheme].background,
                }}
            />

            <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
        </div>
    );
};

interface GlassMorphismBoxProps extends HTMLAttributes<HTMLDivElement> {
    childrenClassName?: string;
}

export const GlassMorphismBox: FunctionComponent<PropsWithChildren<GlassMorphismBoxProps>> = ({
    className,
    childrenClassName,
    style,
    children,
}) => {
    const currentTheme = useHudTheme();
    const { glassmorphismColors } = useDaltonism();

    const childrenRef = useRef<HTMLDivElement>(null);

    const { height } = childrenRef.current?.getBoundingClientRect() || { height: undefined };

    const currentBorderColor = glassmorphismColors[currentTheme].border;

    return (
        <div className="relative w-full h-full">
            <div ref={childrenRef} className={cn('absolute', childrenClassName)}>
                {children}
            </div>
            <div
                className={cn('absolute transition-all duration-1000 border-2 border-transparent', className)}
                style={{
                    height,
                    ...style,
                    background: `linear-gradient(-40deg, ${currentBorderColor}FC 0%, ${currentBorderColor}1A 25%, ${currentBorderColor}1A 75%, ${currentBorderColor}FC 100%) border-box`,
                    WebkitMask: `linear-gradient(${currentBorderColor} 0 0) padding-box, linear-gradient(${currentBorderColor} 0 0) border-box`,
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />
        </div>
    );
};
