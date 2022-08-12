import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../store';

export const usePhoto = () => {
    const photos = useSelector((state: RootState) => state.photo);

    const getPhotos = useCallback(() => {
        return photos;
    }, [photos]);

    return {
        getPhotos,
    };
};
