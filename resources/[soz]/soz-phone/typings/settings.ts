export interface PreDBSettings {
    number: string;
    url?: string;
}

export enum SettingsEvents {
    GET_AVATAR = 'phone:getAvatar',
    UPDATE_PICTURE = 'phone:updateProfilePicture',
}
