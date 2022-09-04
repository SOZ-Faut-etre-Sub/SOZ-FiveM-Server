import { useState } from 'react';

import { useInputNuiEvent } from './nui';

export const useIsInInput = () => {
    const [isInInput, setIsInInput] = useState(false);

    useInputNuiEvent('InInput', inInput => {
        setIsInInput(inInput);
    });

    return isInInput;
};
