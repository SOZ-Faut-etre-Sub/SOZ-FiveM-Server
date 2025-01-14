import { useAtomValue, useSetAtom } from 'jotai';
import { atom } from 'jotai/index';

import { CallHistory, Contact, Message, MessageConversation, Separator } from '../../../../../shared/phone/simcard';
import { useNuiEvent } from '../../../../hook/nui';
import { useInjectDebugData } from '../debug/hooks/useInjectDebugData';
import { mockCallHistory } from './call-history.constant';
import { mockContacts } from './contacts.constant';
import { mockConversations, mockMessages } from './messages.constant';
import { ActiveCall } from './sim.types';

export const numberAtom = atom<string>('');
export const societyNumberAtom = atom<string>();

export const avatarAtom = atom<string>();

export const callModalOpenAtom = atom<boolean>(false);
export const currentCallAtom = atom<ActiveCall>();

export const callHistoryAtom = atom<Array<CallHistory>>([]);
export const contactsAtom = atom<Array<Contact>>([]);
export const contactSearchQueryAtom = atom<string>('');
export const filteredContactsAtom = atom<Array<Contact | Separator>>(get => {
    const contacts = get(contactsAtom);
    const searchQuery = get(contactSearchQueryAtom);

    let lastLetter = '';
    const contactList: (Contact | Separator)[] = [];

    contacts
        .filter(
            contact =>
                contact?.display?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact?.number?.includes(searchQuery)
        )
        .sort((a, b) => {
            if (a.favorite && !b.favorite) {
                return -1;
            } else if (!a.favorite && b.favorite) {
                return 1;
            } else {
                return a.display.localeCompare(b.display);
            }
        })
        .forEach(contact => {
            const letter = (contact.display ? contact.display[0] : '#').toUpperCase();
            const isFavorite = contact.favorite;

            if (isFavorite && lastLetter !== '★') {
                contactList.push({
                    separator: true,
                    display: 'Favoris',
                });
                lastLetter = '★';
            }

            if (!isFavorite && letter !== lastLetter) {
                contactList.push({
                    separator: true,
                    display: letter,
                });
                lastLetter = letter;
            }
            contactList.push(contact);
        });

    return contactList;
});

export const conversationsAtom = atom<Array<MessageConversation>>([]);
export const conversationSearchQueryAtom = atom<string>('');
export const filteredConversationsAtom = atom<Array<MessageConversation & { last_message: string }>>(get => {
    const conversations = get(conversationsAtom);
    const messages = get(messagesAtom);
    const contacts = get(contactsAtom);
    const searchQuery = get(conversationSearchQueryAtom);

    return conversations
        .filter(c => !c.masked)
        .filter(c => messages.some(m => m.conversation_id === c.conversation_id))
        .filter(c => {
            const contact = contacts.find(contact => contact.number === c.phoneNumber);
            if (!contact) return true;
            return (
                contact?.display?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact?.number?.includes(searchQuery)
            );
        })
        .map(c => ({
            ...c,
            last_message: messages
                .filter(m => m.conversation_id === c.conversation_id)
                .sort((a, b) => b.createdAt - a.createdAt)?.[0]?.message,
        }));
});

export const messagesAtom = atom<Array<Message>>([]);

export const useCallModalOpen = () => useAtomValue(callModalOpenAtom);
export const useSetCallModalOpen = () => useSetAtom(callModalOpenAtom);

export const useSimCardStateHandlers = () => {
    const setNumber = useSetAtom(numberAtom);
    const setAvatar = useSetAtom(avatarAtom);

    const setSocietyNumber = useSetAtom(societyNumberAtom);

    const setCallModalOpen = useSetAtom(callModalOpenAtom);
    const setCurrentCall = useSetAtom(currentCallAtom);

    const setCallHistory = useSetAtom(callHistoryAtom);
    const setContacts = useSetAtom(contactsAtom);
    const setConversations = useSetAtom(conversationsAtom);
    const setMessages = useSetAtom(messagesAtom);

    useNuiEvent('phone', 'SetSimCard', setNumber);
    useNuiEvent('phone', 'SetSimCardAvatar', setAvatar);

    useNuiEvent('phone', 'SetSocietySimCard', setSocietyNumber);

    useNuiEvent('phone', 'SetCallsHistory', setCallHistory);

    useNuiEvent('phone', 'SetConversations', setConversations);
    useNuiEvent('phone', 'UpdateConversation', (conversation: MessageConversation) =>
        setConversations(conversations =>
            conversations.map(c => (c.conversation_id === conversation.conversation_id ? { ...c, ...conversation } : c))
        )
    );

    useNuiEvent('phone', 'SetMessages', setMessages);
    useNuiEvent('phone', 'AddMessage', (message: Message) => setMessages(messages => [...messages, message]));

    useNuiEvent('phone', 'SetContacts', setContacts);
    useNuiEvent('phone', 'AddContact', (contact: Contact) => setContacts(contacts => [...contacts, contact]));
    useNuiEvent('phone', 'UpdateContact', (contact: Contact) =>
        setContacts(contacts => contacts.map(c => (c.id === contact.id ? { ...c, ...contact } : c)))
    );
    useNuiEvent('phone', 'RemoveContact', (id: number) =>
        setContacts(contacts => contacts.filter(contact => contact.id !== id))
    );

    useInjectDebugData(() => {
        setNumber('555-5555');
        setSocietyNumber('555-FBI');

        setCallModalOpen(true);
        setCurrentCall({
            channelId: 1,
            receiver: '555-5556',
            transmitter: '555-5555',
            is_accepted: true,
            isTransmitter: true,
            startedAt: Date.now(),
        });

        setCallHistory(mockCallHistory);
        setContacts(mockContacts);

        setConversations(mockConversations);
        setMessages(mockMessages);
    });
};
