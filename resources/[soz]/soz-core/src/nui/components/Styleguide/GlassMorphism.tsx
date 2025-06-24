import { FunctionComponent, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { GlassMorphismContext } from '../../providers/GlassMorphismProvider';
import { RootState } from '../../store';

interface GlassMorphismProps {
    globalHide: boolean;
}

export const GlassMorphism: FunctionComponent<GlassMorphismProps> = ({ globalHide }) => {
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

    useEffect(() => {
        glassmorphismWorker.postMessage({
            type: globalHide ? 'hide' : 'show',
        });
    }, [globalHide]);

    return <canvas className="absolute" ref={canvas} width={window.innerWidth} height={window.innerHeight} />;
};
