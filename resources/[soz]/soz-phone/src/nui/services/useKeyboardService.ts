import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { debounce } from '../utils/debounce';

export const useKeyboardService = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const onKeyUp = debounce(
        useCallback(
            (event: KeyboardEvent) => {
                if (event.key !== 'Backspace') {
                    return;
                }

                if (['input', 'textarea'].includes((event.target as HTMLElement).nodeName.toLowerCase())) {
                    return;
                }

                if (pathname === '/') {
                    return;
                }

                navigate(-1);
            },
            [navigate, pathname]
        ),
        100
    );

    useEffect(() => {
        window.addEventListener('keyup', onKeyUp);

        return () => window.removeEventListener('keyup', onKeyUp);
    }, [onKeyUp]);
};
