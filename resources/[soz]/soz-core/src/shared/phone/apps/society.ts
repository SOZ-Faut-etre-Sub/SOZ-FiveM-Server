export type SocietyContact = {
    display: string;
    number: string;
    avatar: string;
    type: 'public' | 'private' | 'urgence';
    order?: number;
    anonymousCallAllowed?: boolean;
};

export type NewSocietyMessage = {
    number: string;
    message: string;
    anonymous: boolean;
    position: boolean;

    type?: string;
    overrideIdentifier?: string;
};

export type UpdateSocietyMessage = Pick<SocietyMessage, 'id' | 'isTaken' | 'isDone'>;

export type SocietyMessage = {
    id: number;
    conversation_id: string;
    source_phone: string;
    message: string;
    htmlMessage?: string;
    position: string;
    isTaken: boolean;
    takenBy: string | null;
    takenByUsername: string | null;
    isDone: boolean;
    createdAt: number;
    updatedAt: number;
    muted?: boolean;
    info?: SocietyMessageInfo;
};

export type SocietyMessageInfo = {
    type?: string;
    serviceNumber?: string;
    duration?: number;
    notificationId?: number;
};
