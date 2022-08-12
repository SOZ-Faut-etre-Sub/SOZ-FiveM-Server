import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardService = () => {
    const navigate = useNavigate();

    const onKeyUp = useCallback(
        (event: KeyboardEvent) => {
            if (event.key !== 'Backspace') {
                return;
            }

            if (['input', 'textarea'].includes((event.target as HTMLElement).nodeName.toLowerCase())) {
                return;
            }

            navigate(-1);
        },
        [navigate]
    );

    useEffect(() => {
        window.addEventListener('keyup', onKeyUp);

        return () => window.removeEventListener('keyup', onKeyUp);
    }, [onKeyUp]);
};
