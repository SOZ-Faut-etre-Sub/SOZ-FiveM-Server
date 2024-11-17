import { useEffect, useRef } from 'react';

export const useInterval = (callback, interval = 1000) => {
    const savedCallback = useRef<(() => void) | null>(null);

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
