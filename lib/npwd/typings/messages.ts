export interface Message {
  id: number;
  message: string;
  conversation_id?: string;
  author: string;
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
}

export interface FormattedMessageConversation {
  conversation_id: string;
  phoneNumber: string;
}

/**
 * Used for the raw npwd_messages_groups row responses
 */
export interface UnformattedMessageConversation {
  conversation_id: string;
  user_identifier: string;
  participant_identifier: string;
  phone_number: string;
  avatar?: string;
  display?: string;
  updatedAt?: string;
  unread: number;
}

/**
 * Used to help consolidate raw npwd_messages_groups rows into
 * a mapping of a single message group
 */
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
}

export enum MessageEvents {
  FETCH_MESSAGE_CONVERSATIONS = 'npwd:fetchMessageGroups',
  FETCH_MESSAGE_GROUPS_SUCCESS = 'npwd:fetchMessageGroupsSuccess',
  FETCH_MESSAGE_GROUPS_FAILED = 'npwd:fetchMessageGroupsFailed',
  CREATE_MESSAGE_CONVERSATION = 'npwd:createMessageGroup',
  CREATE_MESSAGE_CONVERSATION_SUCCESS = 'npwd:createMessageConversationSuccess',
  CREATE_MESSAGE_GROUP_SUCCESS = 'npwd:createMessageGroupSuccess',
  CREATE_MESSAGE_GROUP_FAILED = 'npwd:createMessageGroupFailed',
  SEND_MESSAGE = 'npwd:sendMessage',
  SEND_MESSAGE_SUCCESS = 'npwd:sendMessageSuccess',
  SEND_MESSAGE_FAILED = 'npwd:sendMessageFailed',
  DELETE_MESSAGE = 'npwd:deleteMessage',
  FETCH_MESSAGES = 'npwd:fetchMessages',
  FETCH_MESSAGES_SUCCESS = 'npwd:fetchMessagesSuccess',
  FETCH_MESSAGES_FAILED = 'npwd:fetchMessagesFailed',
  FETCH_INITIAL_MESSAGES = 'npwd:fetchInitialMessages',
  ACTION_RESULT = 'npwd:setMessagesAlert',
  CREATE_MESSAGE_BROADCAST = 'createMessagesBroadcast',
  SET_MESSAGE_READ = 'npwd:setReadMessages',
  DELETE_CONVERSATION = 'nwpd:deleteConversation',
}
