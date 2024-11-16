import cn from 'classnames';
import {
    FunctionComponent,
    HTMLAttributes,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { uuidv4 } from '../../../core/utils';
import { GlassMorphismContext } from '../../providers/GlassMorphismProvider';
import { useHudColor } from '../Hud/hooks/useHudColor';

type GameCanvasBoxProps = {
    disableGameClone?: boolean;
    borderClassName?: string;
    rounded?: number;
    circle?: boolean;
    blur?: boolean;
};

export const GameCanvasBox: FunctionComponent<PropsWithChildren<GameCanvasBoxProps>> = ({
    borderClassName,
    disableGameClone = false,
    blur = true,
    rounded,
    circle,
    children,
}) => {
    const glassmorphismWorker = useContext(GlassMorphismContext);
    const [canvasUUID] = useState(uuidv4());

    const containerRef = useRef<HTMLDivElement>(null);
    const containerRect = useRef<DOMRect | null>(null);

    const updateContainerRect = useCallback(() => {
        const container = containerRef.current?.getBoundingClientRect();
        if (!container) return;

        if (
            containerRect.current?.x !== container?.x ||
            containerRect.current?.y !== container?.y ||
            containerRect.current?.width !== container?.width ||
            containerRect.current?.height !== container?.height
        ) {
            containerRect.current = container;
            setTimeout(updateContainerRect, 100);
        }
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current?.getBoundingClientRect();

        glassmorphismWorker.postMessage({
            type: 'add',
            uuid: canvasUUID,
            x: container?.x,
            y: container?.y,
            width: container?.width,
            height: container?.height,
            options: {
                disableGameClone,
                blur,
                rounded,
                circle,
            },
        });

        containerRect.current = container;
        setTimeout(updateContainerRect, 100);
    }, [containerRef.current, updateContainerRect]);

    useEffect(() => {
        glassmorphismWorker.postMessage({
            type: 'update',
            uuid: canvasUUID,
            x: containerRect.current?.x,
            y: containerRect.current?.y,
            width: containerRect.current?.width,
            height: containerRect.current?.height,
            options: {
                disableGameClone,
                blur,
                rounded,
                circle,
            },
        });
    }, [containerRect.current, disableGameClone, blur, rounded, circle]);

    useEffect(() => {
        return () => {
            glassmorphismWorker.postMessage({
                type: 'remove',
                uuid: canvasUUID,
            });
        };
    }, []);

    return (
        <div ref={containerRef} className={cn('relative h-full w-full', borderClassName)}>
            {children}
        </div>
    );
};

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

interface GlassMorphismBoxProps extends HTMLAttributes<HTMLDivElement> {
    childrenClassName?: string;
    duration?: string;
}

export const GlassMorphismBox: FunctionComponent<PropsWithChildren<GlassMorphismBoxProps>> = ({
    className,
    childrenClassName,
    style,
    children,
    duration = 'duration-1000',
}) => {
    const { glassmorphismColors } = useHudColor();

    const childrenRef = useRef<HTMLDivElement>(null);

    const { height } = childrenRef.current?.getBoundingClientRect() || { height: undefined };

    const currentBorderColor = glassmorphismColors.border;

    return (
        <div className="relative w-full h-full">
            <div ref={childrenRef} className={cn('absolute', childrenClassName)}>
                {children}
            </div>
            <div
                className={cn('absolute transition-all border-2 border-transparent', duration, className)}
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
