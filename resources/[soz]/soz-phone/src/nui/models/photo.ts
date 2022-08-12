import { createModel } from '@rematch/core';

import { GalleryPhoto } from '../../../typings/photo';
import { RootModel } from '.';

export const photo = createModel<RootModel>()({
    state: [] as GalleryPhoto[],
    reducers: {
        set: (state, payload) => {
            return [...payload];
        },
        add: (state, payload) => {
            return [...state, payload];
        },
        remove: (state, payload) => {
            return [...state.filter(photo => photo.id !== payload)];
        },
    },
    effects: dispatch => ({
        async setPhotos(payload: GalleryPhoto[]) {
            dispatch.photo.set(payload);
        },
        async appendPhoto(payload: GalleryPhoto) {
            dispatch.photo.add(payload);
        },
        async removePhoto(payload: number) {
            dispatch.photo.remove(payload);
        },
    }),
});
