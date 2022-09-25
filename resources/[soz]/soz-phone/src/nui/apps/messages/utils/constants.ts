import { ServerPromiseResp } from '@typings/common';
import { Message, MessageConversation } from '@typings/messages';

export const MockMessageConversations: MessageConversation[] = [
    {
        conversation_id: '555-1111+555-2222',
        avatar: 'https://i.imgur.com/GCBVgXD.jpeg',
        phoneNumber: '555-2222',
        unread: 0,
        display: 'Taso',
        updatedAt: 1598420000000,
    },
    {
        conversation_id: '555-1111+555-3333',
        avatar: '',
        phoneNumber: '555-3333',
        unread: 3,
        display: 'Chip',
        updatedAt: 1598400000000,
    },
    {
        conversation_id: '555-1111+555-4444',
        avatar: '',
        phoneNumber: '555-4444',
        unread: 0,
        display: '',
        updatedAt: 1598400000000,
    },
];

export const MockConversationMessages: Message[] = [
    {
        id: 1,
        author: '555-1111',
        message: 'Hello',
        conversation_id: '555-1111+555-3333',
    },
    {
        id: 2,
        author: '555-1111',
        message:
            'Hi asljdf klasdfjkasjdf sdfjf asdf djkjas k kksdfjjsl ks kldfs d fd asd asdfjasdjfjasdkljjfklasjldfjlj asdf sadfdsdkafjkljsdklfjklfjdf',
        conversation_id: '555-1111+555-3333',
    },
    {
        id: 3,
        author: '555-3333',
        message: 'Hello',
        conversation_id: '555-1111+555-3333',
    },
    {
        id: 4,
        author: '555-2222',
        message: 'Hello Rocky',
        conversation_id: '555-1111+555-2222',
    },
    {
        id: 5,
        author: '555-1111',
        message: 'https://i.tasoagc.dev/LtuA.png',
        conversation_id: '555-1111+555-3333',
    },
    {
        id: 6,
        author: '555-1111',
        message: 'vec2(355.555,-8754.54)',
        conversation_id: '555-1111+555-3333',
    },
];

export const MockConversationServerResp: ServerPromiseResp<Message[]> = {
    data: MockConversationMessages,
    status: 'ok',
};
