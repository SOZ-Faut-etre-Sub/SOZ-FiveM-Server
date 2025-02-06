export type CallHistory = {
    id?: number;
    identifier: string;
    transmitter: string;
    transmitterSource?: number;
    receiver: string;
    receiverSource?: number;
    start: number;
    end?: number;
    is_accepted: boolean;
};

export type ActiveCall = Omit<CallHistory, 'id'> & { isTransmitter?: boolean; muted?: boolean; speaker?: boolean };

export type Contact = {
    id?: number;
    display: string;
    number: string;
    avatar?: string;
    favorite?: boolean;
};

export type ContactDTO = Omit<Contact, 'id' | 'avatar'>;

export type Separator = {
    id?: number;
    display: string;
    separator: true;
};

export type MessageConversation = {
    id: number;
    conversation_id: string;
    avatar: string;
    display: string;
    phoneNumber: string;
    unread: number;
    updatedAt: number;
    masked: boolean;
};

export type NewMessageConversation = Pick<MessageConversation, 'phoneNumber'>;
export type UpdateMessageConversation = Pick<MessageConversation, 'id' | 'conversation_id'>;

export type Message = {
    id: number;
    message: string;
    conversation_id?: string;
    author: string;
    createdAt: number;
};

export type NewMessage = Pick<Message, 'conversation_id' | 'message'>;
