import { uuidv4 } from '@core/utils';
import cn from 'classnames';
import { FunctionComponent, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useInterval } from '../../hook/useInterval';
import { GlassMorphismContext } from '../../providers/GlassMorphismProvider';

type GameCanvasBoxProps = {
    disableGameClone?: boolean;
    borderClassName?: string;
    cantBeHidden?: boolean;
    rounded?: number;
    circle?: boolean;
    blur?: boolean;
};

export const GameCanvasBox: FunctionComponent<PropsWithChildren<GameCanvasBoxProps>> = ({
    borderClassName,
    disableGameClone = false,
    blur = true,
    cantBeHidden = false,
    rounded,
    circle,
    children,
}) => {
    const gameView = useContext(GlassMorphismContext);
    const [canvasUUID] = useState(uuidv4());

    const containerRef = useRef<HTMLDivElement>(null);
    const containerRect = useRef<DOMRect | null>(null);

    const updateGlassmorphism = useCallback(() => {
        gameView.updateCanvas(
            canvasUUID,
            containerRect.current?.x,
            containerRect.current?.y,
            containerRect.current?.width,
            containerRect.current?.height,
            {
                cantBeHidden,
                disableGameClone,
                blur,
                rounded,
                circle,
            }
        );
    }, [disableGameClone, blur, rounded, circle]);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current?.getBoundingClientRect();

        gameView.addCanvas(canvasUUID, container?.x, container?.y, container?.width, container?.height, {
            cantBeHidden,
            disableGameClone,
            blur,
            rounded,
            circle,
        });

        containerRect.current = container;
    }, [containerRef.current]);

    useEffect(() => {
        gameView.updateCanvas(
            canvasUUID,
            containerRect.current?.x,
            containerRect.current?.y,
            containerRect.current?.width,
            containerRect.current?.height,
            {
                cantBeHidden,
                disableGameClone,
                blur,
                rounded,
                circle,
            }
        );
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
        return () => gameView.removeCanvas(canvasUUID);
    }, []);

    return (
        <div ref={containerRef} className={cn('relative h-full w-full', borderClassName)}>
            {children}
        </div>
    );
};
