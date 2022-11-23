export interface Message {
    id: number;
    message: string;
    conversation_id?: string;
    author: string;
    createdAt: number;
}

export interface PreDBMessage {
    conversationId: string;
    message: string;
}

export interface MessageConversation {
    conversation_id: string;
    avatar: string;
    display: string;
    phoneNumber: string;
    unread: number;
    updatedAt: number;
    masked: boolean;
}

export interface FormattedMessageConversation {
    conversation_id: string;
    phoneNumber: string;
}

export interface UnformattedMessageConversation {
    conversation_id: string;
    user_identifier: string;
    participant_identifier: string;
    avatar?: string;
    display?: string;
    updatedAt: number;
    unread: number;
}

export interface MessageGroupMapping {
    [groupId: string]: {
        user_identifier: string;
        // Participant displays
        participants: string[];
        phoneNumbers: string[];
        label?: string;
        avatar?: string;
        updatedAt: string;
        unreadCount: number;
    };
}

export interface CreateMessageGroupResult {
    error?: boolean;
    phoneNumber?: string;
    duplicate?: boolean;
    conversationId?: string;
    mine?: boolean;
    participant: string;
    identifiers: string[];
    updatedAt: number;
    doesExist: UnformattedMessageConversation | null;
}

export interface CreateMessageBroadcast {
    message: string;
    groupName: string;
    groupId: string;
}

export interface SetMessageRead {
    groupId: string;
}

export interface MessageConversationResponse {
    conversation_id: string;
    phoneNumber: string;
    updatedAt: number;
}

export enum MessageEvents {
    FETCH_MESSAGE_CONVERSATIONS = 'phone:fetchMessageGroups',
    FETCH_MESSAGE_GROUPS_SUCCESS = 'phone:fetchMessageGroupsSuccess',
    FETCH_MESSAGE_GROUPS_FAILED = 'phone:fetchMessageGroupsFailed',
    CREATE_MESSAGE_CONVERSATION = 'phone:createMessageGroup',
    CREATE_MESSAGE_CONVERSATION_SUCCESS = 'phone:createMessageConversationSuccess',
    UPDATE_MESSAGE_CONVERSATION_SUCCESS = 'phone:updateMessageConversationSuccess',
    CREATE_MESSAGE_GROUP_SUCCESS = 'phone:createMessageGroupSuccess',
    CREATE_MESSAGE_GROUP_FAILED = 'phone:createMessageGroupFailed',
    SEND_MESSAGE = 'phone:sendMessage',
    SEND_MESSAGE_SUCCESS = 'phone:sendMessageSuccess',
    SEND_MESSAGE_FAILED = 'phone:sendMessageFailed',
    FETCH_MESSAGES = 'phone:fetchMessages',
    FETCH_MESSAGES_SUCCESS = 'phone:fetchMessagesSuccess',
    FETCH_MESSAGES_FAILED = 'phone:fetchMessagesFailed',
    FETCH_INITIAL_MESSAGES = 'phone:fetchInitialMessages',
    ACTION_RESULT = 'phone:setMessagesAlert',
    CREATE_MESSAGE_BROADCAST = 'createMessagesBroadcast',
    SET_MESSAGE_READ = 'phone:setReadMessages',
    DELETE_CONVERSATION = 'phone:deleteConversation',
    GET_POSITION = 'phone:getCurrentPosition',
    GET_DESTINATION = 'phone:getCurrentDestination',
    SET_WAYPOINT = 'phone:setWaypoint',
    SET_CONVERSATION_ARCHIVED = 'phone:setConversationArchived',
}
