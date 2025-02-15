import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';

import { DarkwebConversation, DarkwebMessage, DarkwebParticipant } from '../../../../../shared/phone/apps/darkweb';
import { useNuiEvent } from '../../../../hook/nui';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';

const enabledAtom = atom(false);

export const conversationsAtom = atom<DarkwebConversation[]>([]);
export const conversationSearchQueryAtom = atom('');
export const filteredConversationsAtom = atom(get => {
    const searchQuery = get(conversationSearchQueryAtom);
    return get(conversationsAtom)
        ?.filter(c => c.masked === false)
        ?.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()));
});

export const participantsAtom = atom<DarkwebParticipant[]>([]);

export const messagesAtom = atom<DarkwebMessage[]>([]);

export const useDarkWebEnabled = () => useAtomValue(enabledAtom);
export const useDarkWebConversations = () => useAtomValue(conversationsAtom);
export const useDarkWebParticipants = () => useAtomValue(participantsAtom);

export const useAppDarkWebStateHandlers = () => {
    const setEnabled = useSetAtom(enabledAtom);

    const setConversations = useSetAtom(conversationsAtom);
    const setParticipants = useSetAtom(participantsAtom);
    const setMessages = useSetAtom(messagesAtom);

    useNuiEvent('phone', 'AppDarkWebHasDongle', setEnabled);

    useInjectDebugData(() => {
        setEnabled(true);

        setConversations([
            {
                id: 3,
                label: 'Conversation secrète 1',
                user_identifier: '555-2222',
                phoneNumber: '555-2222',
                masked: false,
                updatedAt: 1598420000000,
                createdAt: 1598410000000,
                password: 'aaaa',
            },
        ]);

        setParticipants([
            {
                conversation_id: 3,
                user_identifier: '555-2222',
                phoneNumber: '555-2222',
                joinedAt: 1598410000000,
                role: 'ADMIN',
                notification: false,
                unread: false,
            },
        ]);

        setMessages([
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
        ]);
    });
};
