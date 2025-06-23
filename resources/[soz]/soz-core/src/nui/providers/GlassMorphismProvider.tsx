import { GameViewRenderer } from '@public/nui/components/Styleguide/glassmorphism/glassmoGameView';
import { useNuiEvent } from '@public/nui/hook/nui';
import { createContext, FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';

export const GlassMorphismContext = createContext<GameViewRenderer>(null);

export const GlassMorphismProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [gameView] = useState<GameViewRenderer>(new GameViewRenderer());

    const initGlassmorphism = () => {
        gameView.resize(window.innerWidth, window.innerHeight);
    };

    useNuiEvent('hud', 'SetGlassmorphismFps', fps => {
        gameView.setFpsLimit(fps);
    });

    useEffect(() => {
        initGlassmorphism();
        window.addEventListener('resize', initGlassmorphism);

        return () => {
            window.removeEventListener('resize', initGlassmorphism);
            gameView.disable();
        };
    }, []);

    return <GlassMorphismContext.Provider value={gameView}>{children}</GlassMorphismContext.Provider>;
};
