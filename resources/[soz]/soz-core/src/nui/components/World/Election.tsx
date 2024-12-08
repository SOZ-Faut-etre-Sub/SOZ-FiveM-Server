import { FunctionComponent, MutableRefObject, useRef } from 'react';

import { useNuiEvent } from '../../hook/nui';

export const Election: FunctionComponent = () => {
    const audioCtx = useRef<AudioContext>(new AudioContext());
    const gainSociety1 = useRef<GainNode>(null);
    const gainSociety2 = useRef<GainNode>(null);
    const gainSenat = useRef<GainNode>(null);

    function handleVolume(id: string, gain: MutableRefObject<GainNode>, value: number) {
        const audioElement = document.querySelector(id) as HTMLMediaElement;

        if (!gain.current) {
            audioElement.load();
            audioElement.loop = false;
            const track = audioCtx.current.createMediaElementSource(audioElement);
            gain.current = audioCtx.current.createGain();
            gain.current.gain.value = 0;
            track.connect(gain.current).connect(audioCtx.current.destination);
        }

        const current = gain.current.gain.value;
        if (current == 0) {
            audioElement.currentTime = 0.0;
            audioElement.play();
        }

        const now = audioCtx.current.currentTime;

        gain.current.gain.setValueAtTime(current, now);

        if (value == 0) {
            gain.current.gain.linearRampToValueAtTime(current / 2, now + 3);
            setTimeout(() => {
                audioElement.pause();
                gain.current.gain.value = 0;
            }, 5_000);
        } else {
            gain.current.gain.linearRampToValueAtTime(value / 50, now + 2);
        }
    }

    useNuiEvent('election', 'society1', value => handleVolume('#election-society1', gainSociety1, value), [
        audioCtx,
        gainSociety1,
    ]);
    useNuiEvent('election', 'society2', value => handleVolume('#election-society2', gainSociety2, value), [
        audioCtx,
        gainSociety2,
    ]);
    useNuiEvent('election', 'senat', value => handleVolume('#election-senat', gainSenat, value), [audioCtx, gainSenat]);

    return (
        <>
            <audio id="election-society1" src="https://cfx-nui-soz-sounds/election/society1.mp3"></audio>
            <audio id="election-society2" src="https://cfx-nui-soz-sounds/election/society2.mp3"></audio>
            <audio id="election-senat" src="https://cfx-nui-soz-sounds/election/senat.mp3"></audio>
        </>
    );
};
