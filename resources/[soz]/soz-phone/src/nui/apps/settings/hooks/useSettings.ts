import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { PreDBSettings, SettingsEvents } from '@typings/settings';
import { SettingOption } from '@ui/hooks/useContextMenu';
import { fetchNui } from '@utils/fetchNui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { store } from '../../../store';

export interface IPhoneSettings {
    language: SettingOption;
    wallpaper: SettingOption;
    frame: SettingOption;
    theme: SettingOption;
    zoom: SettingOption;
    streamerMode: boolean;
    ringtone: SettingOption;
    ringtoneVol: number;
    notiSound: SettingOption;
    notiSoundVol: number;
}

export const useSettingsAPI = () => {
    const [t] = useTranslation();
    const { addAlert } = useSnackbar();

    const updateProfilePicture = useCallback(
        ({ number, url }: PreDBSettings) => {
            fetchNui<ServerPromiseResp<void>>(SettingsEvents.UPDATE_PICTURE, {
                number,
                url,
            }).then(serverResp => {
                if (serverResp.status !== 'ok') {
                    return addAlert({
                        message: t('SETTINGS.FEEDBACK.UPDATE_FAILED'),
                        type: 'error',
                    });
                }

                store.dispatch.simCard.SET_AVATAR(url);
                addAlert({
                    message: t('SETTINGS.FEEDBACK.UPDATE_SUCCESS'),
                    type: 'success',
                });
            });
        },
        [addAlert, t]
    );

    return { updateProfilePicture };
};
