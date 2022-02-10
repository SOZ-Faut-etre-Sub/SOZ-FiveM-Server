import {atom, DefaultValue, useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import config from '../../../config/default.json';
import {SettingOption} from '@ui/hooks/useContextMenu';
import {Schema, Validator} from 'jsonschema';
import {useCallback} from "react";
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {PreDBSettings, SettingsEvents} from "@typings/settings";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "@os/snackbar/hooks/useSnackbar";

const NPWD_STORAGE_KEY = 'soz_settings';

const v = new Validator();

const settingOptionSchema: Schema = {
    id: '/SettingOption',
    type: 'object',
    properties: {
        label: {type: 'string'},
        val: {type: 'string'},
    },
    required: true,
};

const settingsSchema: Schema = {
    type: 'object',
    properties: {
        language: {$ref: '/SettingOption'},
        wallpaper: {$ref: '/SettingOption'},
        frame: {$ref: '/SettingOption'},
        theme: {$ref: '/SettingOption'},
        zoom: {$ref: '/SettingOption'},
        streamerMode: {type: 'boolean'},
        ringtone: {$ref: '/SettingOption'},
        ringtoneVol: {type: 'number'},
        notiSound: {$ref: '/SettingOption'},
        notiSoundVol: {type: 'number'},
    },
    required: true,
};

v.addSchema(settingOptionSchema, '/SettingOption');

function isSchemaValid(schema: string): boolean {
    const storedSettings = JSON.parse(schema);
    const resp = v.validate(storedSettings, settingsSchema);
    return resp.valid;
}

export function isSettingsSchemaValid(): boolean {
    const localStore = localStorage.getItem(NPWD_STORAGE_KEY);
    if (localStore) {
        try {
            const parsedSettings = JSON.parse(localStore);
            return v.validate(parsedSettings, settingsSchema).valid;
        } catch (e) {
            console.error('Unable to parse settings JSON', e);
        }
    }
    return true;
}

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
    (key) =>
        ({setSelf, onSet}) => {
            const savedVal = localStorage.getItem(key);
            if (savedVal) {
                try {
                    const validString = isSchemaValid(savedVal);
                    if (validString) {
                        setSelf(JSON.parse(savedVal));
                    } else {
                        console.error('Settings Schema was invalid, applying default settings');
                        setSelf(config.defaultSettings);
                    }
                } catch (e) {
                    // If we are unable to parse the json string, we set default settings
                    console.error('Unable to parse JSON');
                    setSelf(config.defaultSettings);
                }
            }

            onSet((newValue) => {
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
export const useSettingsValue = () => useRecoilValue(settingsState);

export const useResetSettings = () => useResetRecoilState(settingsState);

export const useCustomWallpaperModal = () => useRecoilState(customWallpaperState);

export const useSettingsAPI = () => {
    const [t] = useTranslation();
    const {addAlert} = useSnackbar();

    const updateProfilePicture = useCallback(
        ({number, url}: PreDBSettings) => {
            fetchNui<ServerPromiseResp<void>>(SettingsEvents.UPDATE_PICTURE, {
                number,
                url,
            }).then((serverResp) => {
                if (serverResp.status !== 'ok') {
                    return addAlert({
                        message: t('CONTACTS.FEEDBACK.ADD_FAILED'),
                        type: 'error',
                    });
                }

                addAlert({
                    message: t('CONTACTS.FEEDBACK.ADD_SUCCESS'),
                    type: 'success',
                });
            });
        },
        [addAlert, t],
    );

    return {updateProfilePicture};
}
