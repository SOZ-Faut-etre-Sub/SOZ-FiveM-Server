import { createModel } from '@rematch/core';

import { ServerPromiseResp } from '../../../../typings/common';
import { SettingsEvents } from '../../../../typings/settings';
import { fetchNui } from '../../utils/fetchNui';
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
        // loader
        async loadAvatar() {
            fetchNui<ServerPromiseResp<string>>(SettingsEvents.GET_AVATAR).then(avatar => {
                dispatch.avatar.setAvatar(avatar.data || '');
            });
        },
    }),
});
