import { useEffect } from 'react';

import { usePhoneAvailable } from '../../phone.atom';
import { useSoundProvider } from '../providers/SoundProvider';
import { useSoundSettings } from './useSound';

export const useRingtoneSound = (
    type: 'ringtone' | 'notiSound' | 'societyNotification' | 'dynamicAlert',
    loop: boolean = false
) => {
    const isPhoneAvailable = usePhoneAvailable();
    const sound = useSoundProvider();

    if (!sound) {
        throw new Error('useRingtoneSound must be wrapped in SoundProvider');
    }

    const options = useSoundSettings(type);

    useEffect(() => {
        if (!sound.isMounted(options.sound)) {
            sound.mount(options.sound, options.volume, loop);
            return;
        }
        sound.volume(options.sound, options.volume);
    }, [sound, options.sound, options.volume]);

    return {
        play: () => {
            if (!isPhoneAvailable) return;
            if (sound.playing(options.sound)) return;

            sound.play(options.sound, options.volume, loop);
        },
        stop: () => sound.stop(options.sound),
        playing: () => sound.playing(options.sound),
    };
};
