export type PhoneConfig = {
    language: SettingOption<string>;
    wallpaper: SettingOption<string>;
    customWallpaper: string;
    frame: SettingOption<string>;
    theme: SettingOption<string>;
    zoom: SettingOption<number>;
    textZoom: SettingOption<number>;
    hidePictures: boolean;
    ringtone: SettingOption<string>;
    notiSound: SettingOption<string>;
    societyNotification: SettingOption<string>;
    customRingtoneUrl: string;
    customNotificationUrl: string;
    customSocietyNotificationUrl: string;
    ringtoneVol: number;
    notiSoundVol: number;
    societyNotificationVol: number;
    handsFree: boolean;
    planeMode: boolean;
    dynamicAlert: boolean;
    dynamicAlertVol: number;
    dynamicAlertDuration: SettingOption<number>;
};

export type SettingOption<T = any> = {
    label: string;
    value: T;
};
