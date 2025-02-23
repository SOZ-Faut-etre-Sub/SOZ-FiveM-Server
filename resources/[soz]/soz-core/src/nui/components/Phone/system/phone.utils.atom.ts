import { fetchNui } from '@public/nui/fetch';
import { atom } from 'jotai';

import { NuiEvent } from '../../../../shared/event/nui';

const flashLightAtom = atom(false);

export const flashLightAtomWithNui = atom(
    get => get(flashLightAtom),
    (get, set) => {
        const newValue = !get(flashLightAtom);
        set(flashLightAtom, newValue);
        fetchNui(NuiEvent.PhoneFlashLight, newValue);
    }
);
