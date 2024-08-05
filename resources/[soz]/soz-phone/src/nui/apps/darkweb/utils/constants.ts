import { DarkwebConversation, DarkwebMessage, DarkwebParticipant } from '@typings/app/darkweb';

export const MockDarkwebConversations: DarkwebConversation[] = [
    {
        id: 3,
        label: 'Conversation secrète 1',
        user_identifier: '555-2222',
        phoneNumber: '555-2222',
        unread: 0,
        masked: false,
        display: 'Taso',
        updatedAt: 1598420000000,
        createdAt: 1598410000000,
        password: 'aaaa',
    },
];
export const MockDarkwebParticipants: DarkwebParticipant[] = [
    {
        conversation_id: 3,
        user_identifier: '555-2222',
        phoneNumber: '555-2222',
        joinedAt: 1598410000000,
        role: 'ADMIN',
        notification: false,
        unread: false,
    },
];

export const MockDarkwebMessages: DarkwebMessage[] = [
    {
        id: 1,
        user_identifier: '555-2222',
        createdAt: 1598400300000,
        message: 'test',
        conversation_id: 3,
        phoneNumber: '555-2222',
    },
    {
        id: 2,
        user_identifier: '555-2222',
        createdAt: 1598400000000,
        message: 'test 1',
        conversation_id: 3,
        phoneNumber: '555-2222',
    },
    {
        id: 3,
        user_identifier: '555-2222',
        createdAt: 1598400900000,
        message: 'test 2',
        conversation_id: 3,
        phoneNumber: '555-2222',
    },
    {
        id: 4,
        user_identifier: '555-2222',
        createdAt: 1598900000000,
        message: 'test 3',
        conversation_id: 3,
        phoneNumber: '555-2222',
    },
    {
        id: 5,
        user_identifier: '555-2222',
        createdAt: 1598900000000,
        message: 'test 3',
        conversation_id: 3,
        phoneNumber: '555-2222',
    },
    {
        id: 6,
        user_identifier: '555-2222',
        createdAt: 1598900000000,
        message: 'test 3',
        conversation_id: 3,
        phoneNumber: '555-2222',
    },
    {
        id: 7,
        user_identifier: '555-2222',
        createdAt: 1598900000000,
        message: 'test 3',
        conversation_id: 3,
        phoneNumber: '555-2222',
    },
    {
        id: 8,
        user_identifier: '555-2222',
        createdAt: 1598900000000,
        message: 'test 3',
        conversation_id: 3,
        phoneNumber: '555-2222',
    },
    {
        id: 9,
        user_identifier: '555-2222',
        createdAt: 1598900000000,
        message: 'test 3',
        conversation_id: 3,
        phoneNumber: '555-2222',
    },
];
