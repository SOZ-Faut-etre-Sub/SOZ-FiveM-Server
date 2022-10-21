import { FunctionComponent } from 'react';

import { useAudioNuiEvent } from '../../hook/nui';

export const AudioApp: FunctionComponent = () => {
    useAudioNuiEvent('PlayAudio', async audio => {
        if (audio.path === null || audio.path === '') {
            return;
        }

        const emitter = new Audio(audio.path);
        emitter.volume = audio.volume;
        await emitter.play();
    });

    return null;
};
