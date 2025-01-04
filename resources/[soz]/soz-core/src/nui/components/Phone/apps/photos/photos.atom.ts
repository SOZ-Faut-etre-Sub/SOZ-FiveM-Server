import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';

import { PhotoItem } from '../../../../../shared/phone/apps/photos';
import { useNuiEvent } from '../../../../hook/nui';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';

const photosAtom = atom<PhotoItem[]>([]);

export const usePhotos = () => useAtomValue(photosAtom);

export const useAppPhotosStateHandlers = () => {
    const setPhotos = useSetAtom(photosAtom);

    useNuiEvent('phone', 'AppPhotosSetData', setPhotos);

    useInjectDebugData(() => {
        const photos: PhotoItem[] = [];

        for (let i = 0; i < 60; i++) {
            photos.push({
                id: i,
                image: 'https://soz.zerator.com/static/game/images/default/cat.webp',
            });
        }

        setPhotos(photos);
    });
};
