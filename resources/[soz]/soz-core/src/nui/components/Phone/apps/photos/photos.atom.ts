import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';

import { PhotoItem } from '../../../../../shared/phone/apps/photos';
import { useNuiEvent } from '../../../../hook/nui';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';

const photosAtom = atom<PhotoItem[]>([]);
const latestPhotoAtom = atom<PhotoItem | null>(get => get(photosAtom)[0] || null);

export const usePhotos = () => useAtomValue(photosAtom);
export const useLatestPhotos = () => useAtomValue(latestPhotoAtom);

export const useAppPhotosStateHandlers = () => {
    const setPhotos = useSetAtom(photosAtom);

    useNuiEvent('phone', 'AppPhotosSetData', setPhotos);
    useNuiEvent('phone', 'AppPhotosAddData', (photo: PhotoItem) => setPhotos(photos => [photo, ...photos]));
    useNuiEvent('phone', 'AppPhotosDeleteData', (id: number) =>
        setPhotos(photos => photos.filter(photo => photo.id !== id))
    );

    useInjectDebugData(() => {
        const photos: PhotoItem[] = [];

        for (let i = 0; i < 60; i++) {
            photos.push({
                id: i,
                image: 'http://localhost/static/game/images/default/cat.webp',
            });
        }

        setPhotos(photos);
    });
};
