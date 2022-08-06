import { useEffect } from 'react';

import { ServerPromiseResp } from '../../../typings/common';
import { GalleryPhoto, PhotoEvents } from '../../../typings/photo';
import { useNuiEvent } from '../../libs/nui/hooks/useNuiEvent';
import { MockPhotoData } from '../apps/photo/utils/constants';
import { store } from '../store';
import { fetchNui } from '../utils/fetchNui';
import { buildRespObj } from '../utils/misc';

export const usePhotoService = () => {
    useEffect(() => {
        fetchNui<ServerPromiseResp<GalleryPhoto[]>>(
            PhotoEvents.FETCH_PHOTOS,
            undefined,
            buildRespObj(MockPhotoData)
        ).then(photos => {
            store.dispatch.photo.setPhotos(photos.data);
        });
    }, []);

    useNuiEvent('PHOTO', PhotoEvents.DELETE_PHOTO_SUCCESS, store.dispatch.photo.appendPhoto);
    useNuiEvent('PHOTO', PhotoEvents.DELETE_PHOTO_SUCCESS, store.dispatch.photo.removePhoto);
};
