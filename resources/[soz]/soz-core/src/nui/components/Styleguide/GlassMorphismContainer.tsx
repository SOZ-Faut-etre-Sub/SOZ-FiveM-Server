import cn from 'classnames';
import { FunctionComponent, HTMLAttributes, PropsWithChildren, useEffect, useRef } from 'react';

import { useHud } from '../../hook/data';

interface GlassMorphismContainerProps extends HTMLAttributes<any>, PropsWithChildren {
    disableBorder?: boolean;
}

export const GlassMorphismContainer: FunctionComponent<GlassMorphismContainerProps> = ({
    className,
    disableBorder,
    children,
}) => {
    const { dateTime } = useHud();

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
            tCtx.filter = `blur(10px)`;

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
            className={cn('relative bg-opacity-10 rounded-full h-full w-full overflow-hidden', {
                'bg-black': dateTime.hour > 6 && dateTime.hour < 18,
                'bg-white': dateTime.hour < 6 || dateTime.hour > 18,
            })}
            style={{
                opacity: 0.99,
            }}
        >
            <div
                ref={containerRef}
                className={cn('absolute flex justify-center items-center backdrop-blur-md rounded-full h-full w-full', {
                    'border-2 border-transparent': !disableBorder,
                })}
                style={{
                    height,
                    // boxShadow: 'inset 0 0 10px rgb(50 50 50 / 0.1)',
                    background:
                        'linear-gradient(120deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,1) 100%) border-box',
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />

            <div ref={childrenRef} className={cn('absolute', className)}>
                {children}
            </div>

            <canvas ref={canvasRef} />
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
