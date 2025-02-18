import { useCallback, useEffect } from 'react';

import { useAssetPath } from '../../../../../hook/assets';
import { useSoundProvider } from '../providers/SoundProvider';
import { useSoundSettings } from './useSound';

interface useEndDialSoundValue {
    startTone: () => void;
}

export const useEndDialSound = (): useEndDialSoundValue => {
    const sound = useSoundProvider();
    const { getPath } = useAssetPath();

    const END_DIAL_URL = getPath(`audio/phone/misc/End-Dial.mp3`);

    if (!sound) {
        throw new Error('useRingtoneSound must be wrapped in SoundProvider');
    }

    const options = useSoundSettings('ringtone');

    useEffect(() => {
        if (!sound.isMounted(END_DIAL_URL)) {
            sound.mount(END_DIAL_URL, options.volume / 2, false);
            return;
        }
        sound.volume(END_DIAL_URL, options.volume / 2);
    }, [sound]);

    const startTone = useCallback(() => {
        sound.play(END_DIAL_URL, options.volume / 2, false);
    }, [sound]);

    return { startTone };
};
