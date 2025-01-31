import { useEffect } from 'react';

import { useAssetPath } from '../../../../../hook/assets';
import { useSoundProvider } from '../providers/SoundProvider';

export const useDialingSound = () => {
    const sound = useSoundProvider();
    const { getPath } = useAssetPath();

    const DIAL_TONE_URL = getPath(`audio/phone/misc/Outgoing-Dial-Effect.mp3`);

    if (!sound) {
        throw new Error('useRingtoneSound must be wrapped in SoundProvider');
    }

    useEffect(() => {
        if (!sound.isMounted(DIAL_TONE_URL)) {
            sound.mount(DIAL_TONE_URL, 0.1, true);
            return;
        }
        sound.volume(DIAL_TONE_URL, 0.1);
    }, [sound]);

    return {
        play: () => {
            if (sound.playing(DIAL_TONE_URL)) return;
            sound.play(DIAL_TONE_URL, 0.1, true);
        },
        stop: () => sound.stop(DIAL_TONE_URL),
        playing: () => sound.playing(DIAL_TONE_URL),
    };
};
