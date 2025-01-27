import { useCallback, useEffect } from 'react';

import { useAssetPath } from '../../../../../hook/assets';
import { useSoundProvider } from '../providers/SoundProvider';

interface useDialingSoundValue {
    startDialTone: () => void;
    endDialTone: () => void;
}

export const useDialingSound = (): useDialingSoundValue => {
    const sound = useSoundProvider();
    const { getPath } = useAssetPath();

    const DIAL_TONE_URL = getPath(`audio/phone/misc/Outgoing-Dial-Effect.mp3`);

    useEffect(() => {
        if (!sound.isMounted(DIAL_TONE_URL)) {
            sound.mount(DIAL_TONE_URL, 0.1, true);
            return;
        }
        sound.volume(DIAL_TONE_URL, 0.1);
    }, [sound]);

    const startDialTone = useCallback(() => {
        if (sound.playing(DIAL_TONE_URL)) return;
        sound.play(DIAL_TONE_URL, 0.1, true);
    }, [sound]);

    const endDialTone = useCallback(() => {
        sound.stop(DIAL_TONE_URL);
    }, [sound]);

    return { startDialTone, endDialTone };
};
