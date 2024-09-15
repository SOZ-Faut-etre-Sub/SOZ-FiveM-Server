import { useEffect } from 'react';

export const useInterval = (callback, interval = 1000, deps = []) => {
    useEffect(() => {
        const timer = setInterval(callback, interval);

        return () => {
            clearInterval(timer);
        };
    }, deps);
};
