import { FunctionComponent, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { GlassMorphismContext } from '../../providers/GlassMorphismProvider';
import { RootState } from '../../store';

export const GlassMorphism: FunctionComponent = () => {
    const glassmorphism = useSelector((state: RootState) => state.hud.useGlassmorphism);

    const glassmorphismWorker = useContext(GlassMorphismContext);
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvas.current.hasAttribute('transfered')) return;
        canvas.current.setAttribute('transfered', 'true');

        const context = canvas.current.transferControlToOffscreen();

        glassmorphismWorker.postMessage(
            {
                type: 'canvas',
                canvas: context,
            },
            [context]
        );
    }, []);

    useEffect(() => {
        glassmorphismWorker.postMessage({
            type: glassmorphism ? 'enable' : 'disable',
        });
    }, [glassmorphism]);

    return <canvas className="absolute" ref={canvas} width={window.innerWidth} height={window.innerHeight} />;
};
