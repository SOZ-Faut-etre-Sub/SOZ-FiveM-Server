import { useAtomValue } from 'jotai';

import { avatarAtom } from '../sim.card.atom';

export const useAvatar = () => {
    const avatar = useAtomValue(avatarAtom);

    const updateAvatar = (avatar: string) => {
        console.log(avatar);
    };

    return {
        avatar,
        updateAvatar,
    };
};
