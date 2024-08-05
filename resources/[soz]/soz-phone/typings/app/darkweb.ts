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
    display?: string;
    updatedAt: number;
    unread: number;
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

export interface DarkwebConversationResult {
    error?: boolean;
    errorMessage?: string;
    conversation: DarkwebConversation;
    conversationParticipants: DarkwebParticipant[];
}

export interface DarkwebParticipantUpdateResult {
    error?: boolean;
    errorMessage?: string;
    participant: DarkwebParticipant;
}

export interface DarkwebMessageResult {
    error?: boolean;
    errorMessage?: string;
    message: DarkwebMessage;
}

export interface DarkwebConversationArchiveResult {
    error?: boolean;
    errorMessage?: string;
    conversation: DarkwebConversation;
}

export interface DarkwebConversationUpdateResult {
    error?: boolean;
    errorMessage?: string;
    conversation: DarkwebConversation;
}

export enum DarkwebEvents {
    FETCH_CONVERSATIONS = 'phone:app:darkweb:fetchConversations',
    FETCH_MESSAGES = 'phone:app:darkweb:fetchMessages',
    FETCH_PARTICIPANTS = 'phone:app:darkweb:fetchParticipants',
    FETCH_CONVERSATION_PARTICIPANTS = 'phone:app:darkweb:fetchConversationParticipants',
    CREATE_CONVERSATION = 'phone:app:darkweb:createConversation',
    CREATE_CONVERSATION_SUCCESS = 'phone:app:darkweb:createConversationSuccess',
    SEND_MESSAGE = 'phone:app:darkweb:sendMessage',
    UPDATE_PARTICIPANT_ROLE = 'phone:app:darkweb:updateParticipantRole',
    ARCHIVE_CONVERSATION = 'phone:app:darkweb:archiveConversation',
    UPDATE_CONVERSATION = 'phone:app:darkweb:updateConversation',
    SET_CONVERSATION_READ = 'phone:app:darkweb:setConversationRead',
    UPDATE_BROADCAST_CONVERSATION_MESSAGES = 'phone:app:darkweb:updateBroadcastConversationMessage',
    UPDATE_BROADCAST_CONVERSATION_MESSAGES_SUCCESS = 'phone:app:darkweb:updateBroadcastConversationMessageSuccess',
    UPDATE_BROADCAST_CONVERSATION = 'phone:app:darkweb:updateBroadcastConversation',
    UPDATE_BROADCAST_CONVERSATION_SUCCESS = 'phone:app:darkweb:updateBroadcastConversationSuccess',
    UPDATE_BROADCAST_PARTICIPANTS = 'phone:app:darkweb:updateBroadcastParticipants',
    UPDATE_BROADCAST_PARTICIPANTS_SUCCESS = 'phone:app:darkweb:updateBroadcastParticipantsSuccess',
}