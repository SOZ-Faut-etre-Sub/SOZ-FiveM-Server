import { ServerPromiseResp } from '@typings/common';
import { Message, MessageConversation } from '@typings/messages';

export const MockMessageConversations: MessageConversation[] = [
    {
        conversation_id: '4444+5555',
        avatar: 'https://i.imgur.com/GCBVgXD.jpeg',
        phoneNumber: '215-8139',
        unread: 0,
        display: 'Taso',
        updatedAt: 1598420000000,
    },
    {
        conversation_id: '4444+7777',
        avatar: '',
        phoneNumber: '603-275-8373',
        unread: 3,
        display: 'Chip',
        updatedAt: 1598400000000,
    },
    {
        conversation_id: '555-1111+555-2222',
        avatar: '',
        phoneNumber: '555-2222',
        unread: 0,
        display: '',
        updatedAt: 1598400000000,
    },
];

export const MockConversationMessages: Message[] = [
    {
        id: 1,
        author: '215-8139',
        message: 'Hello',
        conversation_id: '4444+5555',
    },
    {
        id: 2,
        author: '215-8139',
        message:
            'Hi asljdf klasdfjkasjdf sdfjf asdf djkjas k kksdfjjsl ks kldfs d fd asd asdfjasdjfjasdkljjfklasjldfjlj asdf sadfdsdkafjkljsdklfjklfjdf',
    },
    {
        id: 3,
        author: '111-1134',
        message: 'Hello',
        conversation_id: '4444+5555',
    },
    {
        id: 4,
        author: '111-1134',
        message: 'Hello Rocky',
        conversation_id: '4444+7777',
    },
    {
        id: 5,
        author: '215-8139',
        message: 'https://i.tasoagc.dev/LtuA.png',
    },
    {
        id: 6,
        author: '215-8139',
        message: 'vec2(355.555,-8754.54)',
    },
];

export const MockConversationServerResp: ServerPromiseResp<Message[]> = {
    data: MockConversationMessages,
    status: 'ok',
};
