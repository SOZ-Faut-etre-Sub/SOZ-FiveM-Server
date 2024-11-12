import { FunctionComponent, useContext, useEffect, useRef } from 'react';

import { GlassMorphismContext } from '../../providers/GlassMorphismProvider';

export const GlassMorphism: FunctionComponent = () => {
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

    return <canvas className="absolute" ref={canvas} width={window.innerWidth} height={window.innerHeight} />;
};
