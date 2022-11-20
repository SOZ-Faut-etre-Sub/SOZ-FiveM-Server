import { createModel } from '@rematch/core';

import { RootModel } from '../index';

export const avatar = createModel<RootModel>()({
    state: null,
    reducers: {
        SET_AVATAR: (state, payload) => {
            return payload;
        },
    },
    effects: dispatch => ({
        setAvatar(payload) {
            dispatch.avatar.SET_AVATAR(payload);
        },
    }),
});
