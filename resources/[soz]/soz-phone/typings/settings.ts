export interface PreDBSettings {
    number: string;
    url?: string;
}

export enum SettingsEvents {
    UPDATE_PICTURE = 'phone:updateProfilePicture',
    SET_AVATAR = 'phone:setAvatar',
}
