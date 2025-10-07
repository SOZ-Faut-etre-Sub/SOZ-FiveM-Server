import { fetchNui } from '@public/nui/fetch';
import { createGameView, GameView } from '@public/nui/hook/createGameView';
import { useNuiEvent } from '@public/nui/hook/nui';
import { NuiEvent } from '@public/shared/event';
import { FunctionComponent, useEffect, useState } from 'react';

export const ScreenshotApp: FunctionComponent = () => {
    const [gameView, setGameView] = useState<GameView>(null);
    const [ready, setReady] = useState<boolean>(false);

    useNuiEvent('screenshot', 'ready', async data => {
        setReady(data);
    });

    useNuiEvent('screenshot', 'screenshot', async name => {
        const blob = await gameView.takeScreenshot(false, true);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            const base64data = reader.result.toString();
            console.log('a', name, blob.size, base64data.length);
            fetchNui(NuiEvent.Screenshot, {
                name,
                data: base64data.toString(),
            });
        };
    });

    useEffect(() => {
        if (gameView !== null) {
            gameView.startRender();
        }

        return () => {
            if (gameView !== null) {
                gameView.stopRender();
            }
        };
    }, [gameView]);

    if (!ready) {
        return null;
    }

    return (
        <canvas
            ref={ref => {
                if (ref && !gameView) {
                    setGameView(createGameView(ref));
                }
            }}
            className="object-cover h-full w-full"
            style={{
                objectPosition: `-${window.innerWidth}px 0`,
            }}
        />
    );
};
