import { usePlayerMetadata } from '../../../../../hook/data';

export const useExtraFrames = () => {
    const casino_diamond_frame = usePlayerMetadata('casino_diamond_frame');

    const frames = [];

    if (casino_diamond_frame === true) {
        frames.push({
            label: 'Diamond',
            value: 'casino_diamond.webp',
        });
    }

    return frames;
};
