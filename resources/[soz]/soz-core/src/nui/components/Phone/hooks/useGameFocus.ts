import { useEffect } from 'react';

import { NuiEvent } from '../../../../shared/event/nui';
import { fetchNui } from '../../../fetch';
import { useSetPhoneInsideInput } from '../system/phone.atom';

export const useGameFocus = () => {
    const setInsideInput = useSetPhoneInsideInput();

    useEffect(() => {
        // Delay the inside input to prevent the input from being triggered when the user is just clicking on the phone
        setTimeout(() => {
            setInsideInput(true);
            fetchNui(NuiEvent.PhoneInsideInput, { insideInput: true });
        }, 200);

        return () => {
            setInsideInput(false);
            fetchNui(NuiEvent.PhoneInsideInput, { insideInput: false });
        };
    }, []);
};
