import { useAtomValue } from 'jotai';

import { avatarAtom } from '../sim.card.atom';

export const useAvatar = () => {
    const avatar = useAtomValue(avatarAtom);

    return {
        avatar,
    };
};
