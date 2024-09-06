import cn from 'classnames';
import { FunctionComponent, HTMLAttributes, PropsWithChildren, useEffect, useRef } from 'react';

import { HudTheme } from '../../../shared/hud';
import { useDateTime, useHud } from '../../hook/data';

interface GlassMorphismContainerProps extends HTMLAttributes<any>, PropsWithChildren {
    borderColor?: string;
    borderClassName?: string;
    disableBorder?: boolean;
    showBorderOnHover?: boolean;
}

export const GlassMorphismContainer: FunctionComponent<GlassMorphismContainerProps> = ({
    className,
    borderColor = '#ffffff',
    borderClassName,
    disableBorder,
    showBorderOnHover,
    children,
}) => {
    const { settings } = useHud();
    const { isDay, isNight } = useDateTime();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<HTMLDivElement>(null);

    const { height } = childrenRef.current?.getBoundingClientRect() || { height: undefined };

    useEffect(() => {
        let animation = null;
        const renderLoop = () => {
            const container = containerRef.current.getBoundingClientRect();

            const canvas = window.parent.document.body.getElementsByTagName('canvas')[0];
            const tCtx = canvasRef.current.getContext('2d');

            canvasRef.current.width = container.width;
            canvasRef.current.height = container.height;
            tCtx.fillStyle = '#FFFFFF';
            tCtx.filter = `blur(5px)`;

            if (!canvas) return;

            const context = canvas.getContext('2d');
            context?.fillRect(0, 0, canvas.width, canvas.height);

            tCtx.drawImage(canvas, -container.x, -container.y);

            animation = requestAnimationFrame(renderLoop);
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
            <div
                ref={containerRef}
                className={cn(
                    'absolute flex justify-center items-center backdrop-blur-sm h-full w-full transition-all border-transparent',
                    borderClassName,
                    {
                        'border-2': !disableBorder,
                        'group-hover:border-2': showBorderOnHover,
                    }
                )}
                style={{
                    height,
                    background: `linear-gradient(-40deg, ${borderColor} 0%, ${borderColor}1A 25%, ${borderColor}1A 75%, ${borderColor} 100%) border-box`,
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />

            <div ref={childrenRef} className={cn('relative z-10', className)}>
                {children}
            </div>

            <div
                className={cn('absolute inset-0 transition-all duration-1000', {
                    'bg-[#F3FBFA] opacity-20':
                        settings.theme === HudTheme.Light || (settings.theme === HudTheme.Auto && isDay),
                    'bg-[#22232A] opacity-45':
                        settings.theme === HudTheme.Dark || (settings.theme === HudTheme.Auto && isNight),
                    'bg-[#33a844] opacity-25': settings.theme === HudTheme.Green,
                })}
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
    const childrenRef = useRef<HTMLDivElement>(null);

    const { height } = childrenRef.current?.getBoundingClientRect() || { height: undefined };

    return (
        <div className="relative w-full h-full">
            <div ref={childrenRef} className={cn('absolute', childrenClassName)}>
                {children}
            </div>
            <div
                className={cn('absolute border-2 border-transparent', className)}
                style={{
                    height,
                    ...style,
                    background:
                        'linear-gradient(120deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,1) 100%) border-box',
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />
        </div>
    );
};
