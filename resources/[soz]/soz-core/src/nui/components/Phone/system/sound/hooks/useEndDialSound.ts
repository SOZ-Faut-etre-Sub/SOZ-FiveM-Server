import { useCallback, useEffect } from 'react';

import { useAssetPath } from '../../../../../hook/assets';
import { useSoundProvider } from '../providers/SoundProvider';

interface useEndDialSoundValue {
    startTone: () => void;
}

export const useEndDialSound = (): useEndDialSoundValue => {
    const sound = useSoundProvider();
    const { getPath } = useAssetPath();

    const END_DIAL_URL = getPath(`audio/phone/misc/End-Dial.mp3`);

    useEffect(() => {
        if (!sound.isMounted(END_DIAL_URL)) {
            sound.mount(END_DIAL_URL, 0.1, false);
            return;
        }
        sound.volume(END_DIAL_URL, 0.1);
    }, [sound]);

    const startTone = useCallback(() => {
        sound.play(END_DIAL_URL, 0.1, false);
    }, [sound]);

    return { startTone };
};
