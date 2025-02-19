import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { useSetPhoneInsideInput } from '../system/phone.atom';

const INPUT_TYPES = ['input', 'textarea'];

export const useKeyboard = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const setInsideInput = useSetPhoneInsideInput();

    const onKeyUp = debounce(
        useCallback(
            (event: KeyboardEvent) => {
                if (event.key !== 'Backspace') {
                    return;
                }

                if (INPUT_TYPES.includes((event.target as HTMLElement)?.nodeName?.toLowerCase())) {
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

    const onClick = (event: MouseEvent) => {
        if (!INPUT_TYPES.includes((event.target as HTMLElement)?.nodeName?.toLowerCase())) {
            setInsideInput(false);
            fetchNui(NuiEvent.PhoneInsideInput, { insideInput: false });

            return;
        }

        setInsideInput(true);
        fetchNui(NuiEvent.PhoneInsideInput, { insideInput: true });
    };

    const onBlur = (event: MouseEvent) => {
        if (!INPUT_TYPES.includes((event.target as HTMLElement)?.nodeName?.toLowerCase())) {
            return;
        }

        setInsideInput(false);
        fetchNui(NuiEvent.PhoneInsideInput, { insideInput: false });
    };

    useEffect(() => {
        window.addEventListener('keyup', onKeyUp);

        window.addEventListener('mouseup', onClick);
        window.addEventListener('blur', onBlur);

        return () => {
            window.removeEventListener('keyup', onKeyUp);

            window.removeEventListener('mouseup', onClick);
            window.removeEventListener('blur', onBlur);
        };
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
