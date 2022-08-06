import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { PreDBSettings, SettingsEvents } from '@typings/settings';
import { SettingOption } from '@ui/hooks/useContextMenu';
import { fetchNui } from '@utils/fetchNui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { atom, DefaultValue, useRecoilState, useResetRecoilState } from 'recoil';

import config from '../../../config/default.json';
import { store } from '../../../store';

const NPWD_STORAGE_KEY = 'soz_settings';

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

const localStorageEffect =
    key =>
    ({ setSelf, onSet }) => {
        const savedVal = localStorage.getItem(key);
        if (savedVal) {
            try {
                setSelf(JSON.parse(savedVal));
            } catch (e) {
                // If we are unable to parse the json string, we set default settings
                console.error('Unable to parse JSON');
                setSelf(config.defaultSettings);
            }
        }

        onSet(newValue => {
            if (newValue instanceof DefaultValue) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(newValue));
            }
        });
    };

export const settingsState = atom<IPhoneSettings>({
    key: 'settings',
    default: config.defaultSettings,
    effects_UNSTABLE: [localStorageEffect(NPWD_STORAGE_KEY)],
});

const customWallpaperState = atom({
    key: 'customWallpaperState',
    default: false,
});

export const useSettings = () => useRecoilState(settingsState);

export const useResetSettings = () => useResetRecoilState(settingsState);

export const useCustomWallpaperModal = () => useRecoilState(customWallpaperState);

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
