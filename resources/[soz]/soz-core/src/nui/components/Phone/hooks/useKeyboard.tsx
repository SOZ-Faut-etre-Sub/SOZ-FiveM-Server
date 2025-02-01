import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useKeyboard = () => {
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
    }, []);
};

function debounce(func, timeout = 300) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}
