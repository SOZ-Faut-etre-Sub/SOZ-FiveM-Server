import { FunctionComponent, MutableRefObject, useRef, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';

export const Meteor: FunctionComponent = () => {
    const audioCtx = useRef<AudioContext>(new AudioContext());
    const gainMusic = useRef<GainNode>(null);
    const gainSiren = useRef<GainNode>(null);
    const meteortrack = useRef<MediaElementAudioSourceNode>(null);
    const [white, setWhite] = useState<boolean>(false);

    useNuiEvent(
        'meteor',
        'start',
        () => {
            setWhite(false);
            const audioElement = document.querySelector('#meteor') as HTMLMediaElement;
            audioElement.load();
        },
        [audioCtx]
    );

    useNuiEvent(
        'meteor',
        'start',
        () => {
            setWhite(false);
            const audioElement = document.querySelector('#meteor') as HTMLMediaElement;
            audioElement.volume = 0.5;
            if (!meteortrack.current) {
                meteortrack.current = audioCtx.current.createMediaElementSource(audioElement);
                meteortrack.current.connect(audioCtx.current.destination);
            }

            audioElement.currentTime = 0.0;
            audioElement.load();
            audioElement.play();

            const audioElementMusic = document.querySelector('#music-event') as HTMLMediaElement;
            if (!gainMusic.current) {
                const track = audioCtx.current.createMediaElementSource(audioElementMusic);
                gainMusic.current = audioCtx.current.createGain();
                track.connect(gainMusic.current).connect(audioCtx.current.destination);
            }

            const now = audioCtx.current.currentTime;
            gainMusic.current.gain.setValueAtTime(gainMusic.current.gain.value, now);
            gainMusic.current.gain.linearRampToValueAtTime(0, now + 3.0);
            setTimeout(() => audioElementMusic.pause(), 3000);

            const audioElementSiren = document.querySelector('#siren') as HTMLMediaElement;
            if (!gainSiren.current) {
                const track = audioCtx.current.createMediaElementSource(audioElementSiren);
                gainSiren.current = audioCtx.current.createGain();
                track.connect(gainSiren.current).connect(audioCtx.current.destination);
            }

            gainSiren.current.gain.setValueAtTime(gainSiren.current.gain.value, now);
            gainSiren.current.gain.linearRampToValueAtTime(0, now + 3.0);
            setTimeout(() => audioElementSiren.pause(), 3000);
        },
        [audioCtx]
    );

    useNuiEvent(
        'meteor',
        'white',
        () => {
            setWhite(true);
            setTimeout(() => setWhite(false), 5000);
        },
        [white, setWhite]
    );

    function handleVolume(id: string, gain: MutableRefObject<GainNode>, value: number) {
        const audioElement = document.querySelector(id) as HTMLMediaElement;

        if (!gain.current) {
            audioElement.load();
            audioElement.loop = true;
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
        gain.current.gain.linearRampToValueAtTime(value / 50, now + 3.0);

        if (value == 0) {
            setTimeout(() => audioElement.pause(), 3000);
        }
    }

    useNuiEvent('meteor', 'music', value => handleVolume('#music-event', gainMusic, value), [audioCtx, gainMusic]);
    useNuiEvent('meteor', 'siren', value => handleVolume('#siren', gainSiren, value), [audioCtx, gainSiren]);

    return (
        <div>
            {white && <div className="w-full h-full grid h-screen bg-white animate-display-in-long opacity-0"></div>}
            <audio id="meteor" src="sounds/meteor.mp3"></audio>
            <audio id="music-event" src="sounds/meteor-musique-v4.mp3"></audio>
            <audio id="siren" src="sounds/reboot.mp3"></audio>
        </div>
    );
};
