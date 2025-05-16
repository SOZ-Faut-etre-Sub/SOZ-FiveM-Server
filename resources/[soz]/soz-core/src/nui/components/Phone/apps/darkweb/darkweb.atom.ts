import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';
import { useNavigate } from 'react-router-dom';

import { DarkwebConversation, DarkwebMessage, DarkwebParticipant } from '../../../../../shared/phone/apps/darkweb';
import { useNuiEvent } from '../../../../hook/nui';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';
import { useNotifications } from '../../system/notifications/hooks/useNotifications';
import { useSimCard } from '../../system/sim-card/hooks/useSimCard';
import { useRingtoneSound } from '../../system/sound/hooks/useRingtoneSound';
import { useDarkWebAPI } from './hooks/useDarkwebApi';

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

    const navigate = useNavigate();
    const { number } = useSimCard();
    const notificationSound = useRingtoneSound('notiSound', false);
    const { addNotification } = useNotifications();

    const conversations = useAtomValue(conversationsAtom);
    const participants = useAtomValue(participantsAtom);
    const setMessages = useSetAtom(messagesAtom);

    useNuiEvent('phone', 'AppDarkWebHasDongle', setEnabled);
    useNuiEvent('phone', 'AppDarkWebNewMessage', message => {
        const conversation = conversations?.find(c => c.id === message.conversation_id);

        const participant = participants?.find(
            p =>
                p.conversation_id === message.conversation_id &&
                p.phoneNumber === number &&
                p.phoneNumber !== message.phoneNumber
        );

        if (conversation && participant && participant?.notification) {
            notificationSound.play();
            addNotification(
                {
                    app: 'darkweb',
                    group: String(message.conversation_id),
                    title: conversation.label,
                    content: message.message,
                    onClick: () => navigate(`/darkweb/conversations`),
                },
                null
            );
        }

        setMessages(prev => {
            if (!prev || !prev.some(m => m.conversation_id === message.conversation_id)) {
                return prev;
            }
            return [...prev, message];
        });
    });
};

export const useAppDarkWebPreloader = () => {
    const { fetchConversations, fetchParticipants } = useDarkWebAPI();

    fetchConversations();
    fetchParticipants();
};

export const useAppDarkWebDebugHandlers = () => {
    const setEnabled = useSetAtom(enabledAtom);

    const setConversations = useSetAtom(conversationsAtom);
    const setParticipants = useSetAtom(participantsAtom);
    const setMessages = useSetAtom(messagesAtom);

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
