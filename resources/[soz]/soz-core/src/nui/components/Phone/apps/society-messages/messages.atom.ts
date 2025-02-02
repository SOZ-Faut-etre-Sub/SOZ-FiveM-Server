import { SocietyMessage } from '@public/shared/phone/apps/society';
import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';
import { useNavigate } from 'react-router-dom';

import { useNuiEvent } from '../../../../hook/nui';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';
import { useNotifications } from '../../system/notifications/hooks/useNotifications';
import { useRingtoneSound } from '../../system/sound/hooks/useRingtoneSound';

const messagesAtom = atom<Array<SocietyMessage>>([]);
const unTakenMessagesCountAtom = atom(get => get(messagesAtom)?.filter(m => !m.isTaken)?.length ?? 0);

export const useSocietyMessages = () => useAtomValue(messagesAtom);
export const useUnTakenMessagesCount = () => useAtomValue(unTakenMessagesCountAtom);

export const useSocietyMessagesStateHandlers = () => {
    const notificationSound = useRingtoneSound('societyNotification', false);
    const { addNotification } = useNotifications();

    const navigate = useNavigate();
    const setMessages = useSetAtom(messagesAtom);

    useNuiEvent('phone', 'AppSocietySetData', setMessages);
    useNuiEvent('phone', 'AppSocietyPatchData', (data: SocietyMessage) => {
        setMessages(prev => {
            const index = prev.findIndex(m => m.id === data.id);
            if (index === -1) {
                notificationSound.play();
                addNotification({
                    app: 'society-messages',
                    title: data.message,
                    onClick: () => navigate('/society-messages'),
                });

                return [data, ...prev];
            }

            const updated = [...prev];
            updated[index] = data;
            return updated;
        });
    });

    useInjectDebugData(() => {
        const messages = [
            {
                id: 1,
                conversation_id: '555-LSPD',
                source_phone: '603-275-8373',
                message: 'Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                position: '{"x":205.12088012695312,"y":1160.4395751953125,"z":226.99560546875}',
                isTaken: false,
                takenBy: null,
                takenByUsername: null,
                isDone: false,
                createdAt: 1659789408000,
                updatedAt: 1659789608000,
            },
            {
                id: 2,
                conversation_id: '555-LSPD',
                source_phone: '555-1234',
                message: 'Lorem ipsum dolor sit amet, cons ectetur adipis cing elit.',
                position: null,
                isTaken: true,
                takenBy: 'XXX',
                takenByUsername: 'John Doe',
                isDone: false,
                createdAt: 1659789408000,
                updatedAt: 1659789608000,
            },
            {
                id: 3,
                conversation_id: '555-LSPD',
                source_phone: '555-1234',
                message: 'Lorem ipsum dolor sit amet, cons ctetur adipi scing elit.',
                position: null,
                isTaken: true,
                takenBy: 'XXX',
                takenByUsername: 'John Doe',
                isDone: true,
                createdAt: 1659789408000,
                updatedAt: 1659789608000,
            },
            {
                id: 4,
                conversation_id: '555-LSPD',
                source_phone: '',
                message: 'Lorem ipsum dolor sit amet, cons ctetur adipi scing elit.',
                position: '{"x":205.12088012695312,"y":1160.4395751953125,"z":226.99560546875}',
                isTaken: true,
                takenBy: 'XXX',
                takenByUsername: 'John Doe',
                isDone: true,
                createdAt: 1659788408000,
                updatedAt: 1659788608000,
                info: {
                    duration: 10000,
                    type: 'shooting',
                },
            },
        ];

        for (let i = 5; i < 400; i++) {
            messages.push({
                id: i,
                conversation_id: '555-LSPD',
                source_phone: '',
                message: 'Lorem ipsum dolor sit amet, cons ctetur adipi scing elit.',
                position: '{"x":205.12088012695312,"y":1160.4395751953125,"z":226.99560546875}',
                isTaken: true,
                takenBy: 'XXX',
                takenByUsername: 'John Doe',
                isDone: true,
                createdAt: 1659759408000,
                updatedAt: 1659759608000,
                info: {
                    duration: 10000,
                    type: randomType(),
                },
            });
            messages.push({
                id: i,
                conversation_id: '555-LSPD',
                source_phone: '',
                message: 'Lorem ipsum dolor sit amet, cons ctetur adipi scing elit.',
                position: '{"x":205.12088012695312,"y":1160.4395751953125,"z":226.99560546875}',
                isTaken: true,
                takenBy: 'XXX',
                takenByUsername: 'John Doe',
                isDone: true,
                createdAt: 1659759408000,
                updatedAt: 1659759608000,
            });
        }

        setMessages(messages);
    });
};

const randomType = () => {
    const types = ['red-alert', 'robbery', 'vandalism', 'racket', 'shooting', 'auto-theft', 'drug', 'explosion'];
    return types[Math.floor(Math.random() * types.length)];
};
