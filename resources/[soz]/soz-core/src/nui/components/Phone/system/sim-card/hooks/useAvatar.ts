import { useAtomValue } from 'jotai';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { fetchNui } from '../../../../../fetch';
import { avatarAtom } from '../sim.card.atom';

export const useAvatar = () => {
    const avatar = useAtomValue(avatarAtom);

    const updateAvatar = async (avatar: string) => {
        await fetchNui(NuiEvent.PhoneSimCardUpdateAvatar, { avatar });
    };

    return {
        avatar,
        updateAvatar,
    };
};
