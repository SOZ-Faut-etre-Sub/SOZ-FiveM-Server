import { useEffect } from 'react';

import { PhotoEvents } from '../../../typings/photo';
import { useNuiEvent } from '../../libs/nui/hooks/useNuiEvent';
import { store } from '../store';

export const usePhotoService = () => {
    useEffect(() => {
        store.dispatch.photo.loadPhotos();
    }, []);

    useNuiEvent('PHOTO', PhotoEvents.UPLOAD_PHOTO_SUCCESS, store.dispatch.photo.appendPhoto);
    useNuiEvent('PHOTO', PhotoEvents.DELETE_PHOTO_SUCCESS, store.dispatch.photo.removePhoto);
};
