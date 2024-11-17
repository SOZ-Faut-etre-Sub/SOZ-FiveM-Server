import cn from 'classnames';
import { FunctionComponent, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { uuidv4 } from '../../../core/utils';
import { useInterval } from '../../hook/useInterval';
import { GlassMorphismContext } from '../../providers/GlassMorphismProvider';

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

    const updateGlassmorphism = useCallback(() => {
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
    }, [disableGameClone, blur, rounded, circle]);

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
    }, [containerRef.current]);

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
    }, [disableGameClone, blur, rounded, circle]);

    useInterval(() => {
        const container = containerRef.current?.getBoundingClientRect();
        if (!container) return;

        if (
            containerRect.current?.x !== container?.x ||
            containerRect.current?.y !== container?.y ||
            containerRect.current?.width !== container?.width ||
            containerRect.current?.height !== container?.height
        ) {
            containerRect.current = container;
            updateGlassmorphism();
        }
    }, 10);

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
