import { FunctionComponent, useRef, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';

export const Meteor: FunctionComponent = () => {
    const audioCtx = useRef<AudioContext>(new AudioContext());
    const listener = useRef<AudioListener>(null);
    const panner = useRef<PannerNode>(null);
    const track1 = useRef<MediaElementAudioSourceNode>(null);
    const gain4 = useRef<GainNode>(null);
    const [white, setWhite] = useState<boolean>(false);

    useNuiEvent(
        'meteor',
        'start',
        () => {
            setWhite(false);
            const audioElement = document.querySelector('#meteor') as HTMLMediaElement;
            const audioElement3 = document.querySelector('#music-meteor') as HTMLMediaElement;
            audioElement3.volume = 0.7;
            const audioElement4 = document.querySelector('#music-event') as HTMLMediaElement;

            if (!listener.current) {
                const audioElement = document.querySelector('#meteor') as HTMLMediaElement;

                listener.current = audioCtx.current.listener;

                listener.current.upX.value = 0;
                listener.current.upY.value = 0;
                listener.current.upZ.value = 1;

                listener.current.forwardX.value = 0;
                listener.current.forwardY.value = 1;
                listener.current.forwardZ.value = 0;

                panner.current = new PannerNode(audioCtx.current, {
                    panningModel: 'HRTF',
                    distanceModel: 'linear',
                    positionX: 0.0,
                    positionY: 0.0,
                    positionZ: 1_000_000,
                    orientationX: 0.0,
                    orientationY: -1.0,
                    orientationZ: 0.0,
                    refDistance: 100,
                    maxDistance: 10_000,
                    rolloffFactor: 1.0,
                    coneInnerAngle: 360,
                    coneOuterAngle: 90,
                    coneOuterGain: 0.4,
                });

                track1.current = audioCtx.current.createMediaElementSource(audioElement);
            }
            if (!gain4.current) {
                const track = audioCtx.current.createMediaElementSource(audioElement4);
                gain4.current = audioCtx.current.createGain();
                track.connect(gain4.current).connect(audioCtx.current.destination);
            }

            panner.current.disconnect();
            track1.current.connect(panner.current).connect(audioCtx.current.destination);

            if (audioCtx.current.state === 'suspended') {
                audioCtx.current.resume();
            }

            audioElement.currentTime = 0;
            audioElement.play();

            audioElement3.currentTime = 0;
            audioElement3.play();

            const now = audioCtx.current.currentTime;
            gain4.current.gain.setValueAtTime(1.0, now);
            gain4.current.gain.linearRampToValueAtTime(Number.EPSILON, now + 3.0);
            setTimeout(() => audioElement4.pause(), 3000);
        },
        [audioCtx, listener, panner]
    );

    useNuiEvent(
        'meteor',
        'update',
        data => {
            if (!listener?.current || !panner?.current) {
                return;
            }

            listener.current.positionX.value = data.playerPosition[0];
            listener.current.positionY.value = data.playerPosition[1];
            listener.current.positionZ.value = data.playerPosition[2];

            listener.current.forwardX.value = -Math.sin(data.heading);
            listener.current.forwardY.value = Math.cos(data.heading);
            listener.current.forwardZ.value = 0;

            panner.current.positionX.value = data.meteorPostion[0];
            panner.current.positionY.value = data.meteorPostion[1];
            panner.current.positionZ.value = data.meteorPostion[2];
        },
        [audioCtx, listener, panner]
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

            if (!gain4.current) {
                const track = audioCtx.current.createMediaElementSource(audioElement);
                gain4.current = audioCtx.current.createGain();
                track.connect(gain4.current).connect(audioCtx.current.destination);
            }

            if (value) {
                gain4.current.gain.value = 1.0;
                audioElement.currentTime = 0.0;
                audioElement.play();
            } else {
                const now = audioCtx.current.currentTime;
                gain4.current.gain.setValueAtTime(1.0, now);
                gain4.current.gain.linearRampToValueAtTime(Number.EPSILON, now + 3.0);
                setTimeout(() => audioElement.pause(), 3000);
            }
        },
        [audioCtx, listener, panner]
    );

    return (
        <div>
            {white && <div className="w-full h-full grid h-screen bg-white animate-display-in-long opacity-0"></div>}
            <audio id="meteor" src="sounds/meteor-v2.mp3"></audio>
            <audio id="music-meteor" src="sounds/meteor-music.mp3"></audio>
            <audio id="music-event" src="sounds/meteor-musique-v4.mp3"></audio>
        </div>
    );
};
