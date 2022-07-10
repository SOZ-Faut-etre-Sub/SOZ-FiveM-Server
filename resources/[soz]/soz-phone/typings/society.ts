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
    takenBy: string;
    takenByUsername: string;
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
    takenBy: string | null;
    takenByUsername: string | null;
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
    CREATE_MESSAGE_BROADCAST = 'npwd:createSocietyMessagesBroadcast',
}

type SocietyNumber = {
    [key: string]: string;
};

export type SocietyInsertDTO = {
    [key: string]: number;
};

export const SocietyNumberList: SocietyNumber = {
    fbi: '555-FBI',
    lspd: '555-LSPD',
    lsmc: '555-LSMC',
    bcso: '555-BCSO',
    news: '555-NEWS',
    garbage: '555-BLUEBIRD',
    taxi: '555-CARLJR',
    food: '555-MARIUS',
    oil: '555-MTP',
    'cash-transfer': '555-STONK',
    bennys: '555-BENNYS',
    upw: '555-UPW',
    pawl: '555-PAWL',
}
