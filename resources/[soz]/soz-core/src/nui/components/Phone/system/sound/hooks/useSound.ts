import { useEffect, useState } from 'react';

import { useAssetPath } from '../../../../../hook/assets';
import { useConfig } from '../../config/config.atom';
import { usePhoneAvailable } from '../../phone.atom';
import { useSoundProvider } from '../providers/SoundProvider';
import { usePreviousState } from './usePreviousState';

interface ISoundOptions {
    volume?: number;
    interrupt?: boolean;
    loop?: boolean;
}

const DEFAULT_OPTIONS = { volume: 1, interrupt: false, loop: false };

export const useSound = (url: string, options: ISoundOptions = DEFAULT_OPTIONS) => {
    const isPhoneAvailable = usePhoneAvailable();

    const { volume: vol, loop: isLoop, interrupt } = options;

    const [isPlaying, setPlaying] = useState<boolean>(false);

    const { mount, play, stop, playing, volume, loop, remove, isMounted } = useSoundProvider();

    const previousInterrupt = usePreviousState(interrupt);
    const previousUrl = usePreviousState(url);

    useEffect(() => {
        const changed = previousUrl !== url;
        if (changed) {
            stop(previousUrl);
            remove(previousUrl);
        }
        if (!isMounted(url)) {
            mount(url, vol, isLoop, changed && isPlaying);
            return;
        }
        if (changed && isPlaying) {
            play(url);
        }
        volume(url, vol);
        loop(url, isLoop);
    }, [url, vol, isLoop, isMounted, volume, loop, mount, previousUrl, stop, remove, isPlaying, play]);

    useEffect(() => {
        if (interrupt) {
            stop(url);
            setPlaying(false);
            return;
        }
        if (!playing(url) && previousInterrupt) {
            play();
            setPlaying(true);
        }
    }, [interrupt, play, playing, previousInterrupt, stop, url]);

    return {
        play: () => {
            if (!isPhoneAvailable) return;
            play(url);
            setPlaying(true);
        },
        stop: () => {
            stop(url);
            setPlaying(false);
        },
        playing: isPlaying,
    };
};

export const useSoundSettings = (type: 'ringtone' | 'notiSound' | 'societyNotification' | 'dynamicAlert') => {
    const { getPath } = useAssetPath();
    const settings = useConfig();

    const audioFolder = type === 'ringtone' ? 'ringtones' : 'notifications';
    const audioFile = type === 'dynamicAlert' ? settings['societyNotification'].value : settings[type].value;

    return {
        sound: getPath(`audio/phone/${audioFolder}/${audioFile}.mp3`),
        volume: settings.planeMode ? 0 : settings[`${type}Vol`] / 100,
    };
};
