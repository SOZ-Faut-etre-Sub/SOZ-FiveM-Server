import { createContext, FunctionComponent, PropsWithChildren, useEffect, useMemo } from 'react';

export const GlassMorphismContext = createContext(null);

export const GlassMorphismProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const sharedWorker = useMemo(
        () =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            new Worker(new URL('../workers/glassmorphism.worker.ts', import.meta.url), {
                type: 'module',
                name: 'GlassMorphismWorker',
            }),
        []
    );

    const initGlassmorphism = () => {
        sharedWorker.postMessage({
            type: 'init',
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    useEffect(() => {
        initGlassmorphism();
        window.addEventListener('resize', initGlassmorphism);

        return () => {
            window.removeEventListener('resize', initGlassmorphism);
            sharedWorker.postMessage({
                type: 'disable',
            });
            sharedWorker.terminate();
        };
    }, []);

    return <GlassMorphismContext.Provider value={sharedWorker}>{children}</GlassMorphismContext.Provider>;
};
