import { ServerPromiseResp } from '@typings/common';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import { fetchNui } from '@utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { MockPhotoData } from '../utils/constants';

export const photoState = {
    photos: atom<GalleryPhoto[]>({
        key: 'galleryPhotos',
        default: selector({
            key: 'defaultGalleryPhotos',
            get: async () => {
                try {
                    const resp = await fetchNui<ServerPromiseResp<GalleryPhoto[]>>(PhotoEvents.FETCH_PHOTOS);
                    LogDebugEvent({ action: 'PhotosFetched', data: resp.data });
                    return resp.data;
                } catch (e) {
                    if (isEnvBrowser()) {
                        return MockPhotoData;
                    }
                    console.error(e);
                    return [];
                }
            },
        }),
    }),
};

export const useSetPhotos = () => useSetRecoilState(photoState.photos);
export const usePhotos = () => useRecoilState(photoState.photos);
export const usePhotosValue = () => useRecoilValue(photoState.photos);
