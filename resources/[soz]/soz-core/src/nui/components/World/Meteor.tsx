import { Music } from '@public/shared/audio';
import { FunctionComponent, MutableRefObject, useRef, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';

export const Meteor: FunctionComponent = () => {
    const audioCtx = useRef<AudioContext>(new AudioContext());
    const gainChronos = useRef<GainNode>(null);
    const gainMusic = useRef<GainNode>(null);
    const gainSiren = useRef<GainNode>(null);
    const gainEarthQuake = useRef<GainNode>(null);
    const gainSandstorm = useRef<GainNode>(null);
    const meteortrack = useRef<MediaElementAudioSourceNode>(null);
    const gainCinis = useRef<GainNode>(null);
    const gainImpact = useRef<GainNode>(null);
    const gainDiesIrae = useRef<GainNode>(null);
    const gainDestruction = useRef<GainNode>(null);
    const gainObsession = useRef<GainNode>(null);
    const [white, setWhite] = useState<boolean>(false);

    useNuiEvent(
        'meteor',
        'load',
        () => {
            setWhite(false);
            const audioElement = document.querySelector('#meteor') as HTMLMediaElement;
            audioElement.load();
        },
        [audioCtx]
    );

    useNuiEvent(
        'meteor',
        'stop',
        () => {
            setWhite(false);
            const audioElement = document.querySelector('#meteor') as HTMLMediaElement;
            audioElement.pause();
        },
        [audioCtx]
    );

    useNuiEvent(
        'meteor',
        'start',
        () => {
            setWhite(false);
            const audioElement = document.querySelector('#meteor') as HTMLMediaElement;
            audioElement.volume = 0.36;
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

            const audioElementChronos = document.querySelector('#chronos') as HTMLMediaElement;
            if (!gainChronos.current) {
                const track = audioCtx.current.createMediaElementSource(audioElementChronos);
                gainChronos.current = audioCtx.current.createGain();
                track.connect(gainChronos.current).connect(audioCtx.current.destination);
            }

            gainChronos.current.gain.setValueAtTime(gainChronos.current.gain.value, now);
            gainChronos.current.gain.linearRampToValueAtTime(0, now + 3.0);
            setTimeout(() => audioElementChronos.pause(), 3000);
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

    function handleVolume(id: string, gain: MutableRefObject<GainNode>, value: number, loop = true) {
        const audioElement = document.querySelector(id) as HTMLMediaElement;

        if (!gain.current) {
            audioElement.load();
            audioElement.loop = loop;
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

    useNuiEvent(
        'meteor',
        'musics',
        value => {
            handleVolume('#music-event', gainMusic, value[Music.Ambiance]);
            handleVolume('#chronos', gainChronos, value[Music.Chronos]);
            handleVolume('#siren', gainSiren, value[Music.Siren]);
            handleVolume('#sandstorm', gainSandstorm, value[Music.SandStorm]);
            handleVolume('#cinis', gainCinis, value[Music.Cinis]);
            handleVolume('#impact', gainImpact, value[Music.Impact]);
            handleVolume('#dies_irae', gainDiesIrae, value[Music.DiesIrae]);
            handleVolume('#obsession', gainObsession, value[Music.Obsession]);
        },
        [audioCtx, gainMusic, gainSandstorm, gainChronos, gainSiren]
    );

    useNuiEvent('meteor', 'earthquake', value => handleVolume('#earthquake', gainEarthQuake, value ? 50.0 : 0.0), [
        audioCtx,
        gainEarthQuake,
    ]);

    useNuiEvent(
        'meteor',
        'destruction',
        value => handleVolume('#destruction', gainDestruction, value ? 5.0 : 0.0, false),
        [audioCtx, gainDestruction]
    );

    return (
        <div>
            {white && <div className="w-full h-full grid h-screen bg-white animate-display-in-long opacity-0"></div>}
            <audio id="chronos" src="https://cfx-nui-soz-sounds/meteor/chronos.mp3"></audio>
            <audio id="meteor" src="https://cfx-nui-soz-sounds/meteor/meteor.mp3"></audio>
            <audio id="music-event" src="https://cfx-nui-soz-sounds/meteor/ambiance.mp3"></audio>
            <audio id="sandstorm" src="https://cfx-nui-soz-sounds/meteor/sandstorm.mp3"></audio>
            <audio id="siren" src="https://cfx-nui-interact-sound/client/html/sounds/system/reboot.ogg"></audio>
            <audio
                id="earthquake"
                src="https://cfx-nui-interact-sound/client/html/sounds/earthquake/earthquake.ogg"
            ></audio>
            <audio id="impact" src="https://cfx-nui-soz-sounds/firestorm/impact.mp3"></audio>
            <audio id="cinis" src="https://cfx-nui-soz-sounds/firestorm/cinis.mp3"></audio>
            <audio id="destruction" src="https://cfx-nui-soz-sounds/firestorm/destruction.mp3"></audio>
            <audio id="dies_irae" src="https://cfx-nui-soz-sounds/firestorm/dies_irae.mp3"></audio>
            <audio id="obsession" src="https://cfx-nui-soz-sounds/whatif/obsession.mp3"></audio>
        </div>
    );
};
