import { useEffect, useRef } from 'react';

interface IUseInterval {
    (callback: () => void, interval: number): void;
}

export const useInterval: IUseInterval = (callback, interval) => {
    const savedCallback = useRef<(() => void) | null>(null);
    // After every render, save the latest callback into our ref.
    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }

        const id = setInterval(tick, interval);
        return () => clearInterval(id);
    }, [interval]);
};
