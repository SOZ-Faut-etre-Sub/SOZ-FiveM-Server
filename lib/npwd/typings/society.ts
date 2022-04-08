export interface PreDBSociety {
  number: string;
  anonymous: boolean;
  message: string;
  position: boolean;
  pedPosition?: string;
}

export interface DBSocietyUpdate {
  id: number;
  take: boolean;
  done: boolean;
}

export interface Society {
  id: number;
  number: string;
  display: string;
  avatar?: string;
}

export interface SocietyMessage {
  id: number;
  conversation_id: string;
  source_phone: string;
  message: string;
  position: string;
  isTaken: boolean;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum SocietiesDatabaseLimits {
  message = 255,
}

export enum SocietyEvents {
  UPDATE_SOCIETY_MESSAGE = 'npwd:updateSocietyMessage',
  SEND_SOCIETY_MESSAGE = 'npwd:sendSocietyMessage',
  FETCH_SOCIETY_MESSAGES = 'npwd:fetchSocietyMessage',
  RESET_SOCIETY_MESSAGES = 'npwd:resetSocietyMessage',
  SEND_SOCIETY_MESSAGE_SUCCESS = 'npwd:sendSocietyMessageSuccess',
  CREATE_MESSAGE_BROADCAST = 'npwd:createSocietyMessagesBroadcast'
}

type SocietyNumber = {
  [key: string]: string
}

export const SocietyNumberList: SocietyNumber = {
  lspd: '555-LSPD',
  lsmc: '555-LSMC',
  bcso: '555-BCSO',
  news: '555-NEWS',
  garbage: '555-BLUEBIRD',
}
