import { useEffect, useState } from 'react';

const STORAGE_KEY = 'soz_settings';

export default function useLocalState(initial) {
    const [value, setValue] = useState(() => {
        if (typeof window !== undefined && window.localStorage) {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        }
        return initial;
    });

    useEffect(() => {
        if (window.localStorage) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        }
    }, [value]);

    return [value, setValue];
}
