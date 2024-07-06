import { FunctionComponent, useRef, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';

export const Meteor: FunctionComponent = () => {
    const audioCtx = useRef<AudioContext>(new AudioContext());
    const gainMusic = useRef<GainNode>(null);
    const [white, setWhite] = useState<boolean>(false);

    useNuiEvent(
        'meteor',
        'start',
        () => {
            setWhite(false);
            const audioElement = document.querySelector('#meteor') as HTMLMediaElement;
            const track = audioCtx.current.createMediaElementSource(audioElement);
            track.connect(audioCtx.current.destination);

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
            gainMusic.current.gain.setValueAtTime(1.0, now);
            gainMusic.current.gain.linearRampToValueAtTime(Number.EPSILON, now + 3.0);
            setTimeout(() => audioElementMusic.pause(), 3000);
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

    useNuiEvent(
        'meteor',
        'music',
        value => {
            const audioElement = document.querySelector('#music-event') as HTMLMediaElement;

            if (!gainMusic.current) {
                const track = audioCtx.current.createMediaElementSource(audioElement);
                gainMusic.current = audioCtx.current.createGain();
                track.connect(gainMusic.current).connect(audioCtx.current.destination);
            }

            if (value) {
                gainMusic.current.gain.value = 1.0;
                audioElement.currentTime = 0.0;
                audioElement.load();
                audioElement.play();
            } else {
                const now = audioCtx.current.currentTime;
                gainMusic.current.gain.setValueAtTime(1.0, now);
                gainMusic.current.gain.linearRampToValueAtTime(Number.EPSILON, now + 3.0);
                setTimeout(() => audioElement.pause(), 3000);
            }
        },
        [audioCtx]
    );

    return (
        <div>
            {white && <div className="w-full h-full grid h-screen bg-white animate-display-in-long opacity-0"></div>}
            <audio id="meteor" src="sounds/meteor.mp3"></audio>
            <audio id="music-event" src="sounds/meteor-musique-v4.mp3"></audio>
        </div>
    );
};
