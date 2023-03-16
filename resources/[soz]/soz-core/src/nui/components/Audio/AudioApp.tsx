import { FunctionComponent, useState } from 'react';

import { useAudioNuiEvent } from '../../hook/nui';

export const AudioApp: FunctionComponent = () => {
    const [, setAudio] = useState<Record<string, HTMLAudioElement>>({});

    useAudioNuiEvent('PlayAudio', async sound => {
        if (sound.path === null || sound.path === '') {
            return;
        }

        const emitter = new Audio(sound.path);
        emitter.volume = sound.volume;

        setAudio(state => {
            state[sound.id] = emitter;
            return state;
        });

        emitter.addEventListener('ended', () => {
            setAudio(state => {
                if (state[sound.id]) {
                    delete state[sound.id];
                    return state;
                }
            });
        });

        await emitter.play();
    });

    useAudioNuiEvent('StopAudio', id => {
        setAudio(state => {
            if (state[id]) {
                state[id].pause();
                delete state[id];
            }

            return state;
        });
    });

    return null;
};
