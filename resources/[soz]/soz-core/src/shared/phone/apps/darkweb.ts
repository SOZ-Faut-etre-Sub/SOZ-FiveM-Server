export const THREAD_PRICE = 500_000;

//

export interface DarkwebState {
    messages: DarkwebMessage[];
    conversations: DarkwebConversation[];
    participants: DarkwebParticipant[];
    lastMessageSend: number;
}

export interface PreDBDarkwebMessage {
    conversationId: number;
    message: string;
}

export interface DarkwebConversation {
    id: number;
    user_identifier: string;
    password: string;
    label: string;
    createdAt: number;
    masked: boolean;
    updatedAt: number;
    phoneNumber: string;
}

export interface DarkwebParticipant {
    conversation_id: number;
    user_identifier: string;
    joinedAt: number;
    role: string;
    phoneNumber: string;
    notification: boolean;
    unread: boolean;
}

export interface DarkwebMessage {
    id: number;
    message: string;
    conversation_id: number;
    user_identifier: string;
    createdAt: number;
    phoneNumber: string;
}
