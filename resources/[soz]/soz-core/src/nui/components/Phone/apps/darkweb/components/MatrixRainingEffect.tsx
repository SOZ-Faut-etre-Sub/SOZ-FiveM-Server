import { useEffect, useRef } from 'react';

const renderMatrix = ref => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');

    canvas.width = 500;
    canvas.height = 1000;

    const alphabet =
        'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = [];

    for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * fontSize;
    }

    return () => {
        context.fillStyle = 'rgba(0, 0, 0, 0.05)'; // black w a tiny bit of alpha
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = 'rgba(0,255,0,0.5)';
        context.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            context.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };
};

export const MatrixRainingEffect = () => {
    const ref = useRef();

    useEffect(() => {
        const render = renderMatrix(ref);
        const intervalId = setInterval(render, 60);

        return () => clearInterval(intervalId);
    }, []);

    return <canvas ref={ref} className="absolute inset-0 -z-10 opacity-50 h-full w-full" />;
};
