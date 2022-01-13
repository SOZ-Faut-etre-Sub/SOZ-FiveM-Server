export interface PreDBSettings {
  number: string;
  url?: string;
}

export enum SettingsEvents {
  UPDATE_PICTURE = 'npwd:updateProfilePicture',
  SET_AVATAR = 'npwd:setAvatar',
}
