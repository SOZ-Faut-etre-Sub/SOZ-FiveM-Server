export interface PreDBSociety {
  number: string;
  message: string;
  position: boolean;
  pedPosition?: string;
}

export interface Society {
  id: number;
  number: string;
  display: string;
  avatar?: string;
}

export enum SocietiesDatabaseLimits {
  message = 255,
}

export enum SocietyEvents {
  SEND_SOCIETY_MESSAGE = 'npwd:sendSocietyMessage',
}
