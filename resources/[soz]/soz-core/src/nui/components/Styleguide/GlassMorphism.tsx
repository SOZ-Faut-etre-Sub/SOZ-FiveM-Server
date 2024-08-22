import { FunctionComponent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { createGameView, GameView } from '../../hook/createGameView';

export const GlassMorphism: FunctionComponent = () => {
    const [gameView, setGameView] = useState<GameView>(null);

    const onWindowResize = () => {
        if (gameView === null) return;

        gameView.resize(window.innerWidth, window.innerHeight);
    };

    useEffect(() => {
        if (gameView !== null) {
            gameView.startRender();
        }

        window.addEventListener('resize', onWindowResize);

        return () => {
            if (gameView !== null) {
                gameView.stopRender();
            }

            window.removeEventListener('resize', onWindowResize);
        };
    }, [gameView]);

    return (
        <>
            {createPortal(
                <canvas
                    ref={ref => {
                        if (ref && !gameView) {
                            setGameView(createGameView(ref));
                        }
                    }}
                    style={{
                        display: 'block',
                        opacity: 0,
                    }}
                />,
                window.parent.document.body
            )}
        </>
    );
};
