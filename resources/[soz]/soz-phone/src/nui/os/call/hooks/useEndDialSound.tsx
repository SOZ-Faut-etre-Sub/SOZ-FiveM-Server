import { useCallback, useEffect } from 'react';

import { useSoundProvider } from '../../sound/hooks/useSoundProvider';

interface useEndDialSoundValue {
    startTone: () => void;
}

const END_DIAL_URL = 'media/misc/End-Dial.mp3';

export const useEndDialSound = (): useEndDialSoundValue => {
    const sound = useSoundProvider();

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
