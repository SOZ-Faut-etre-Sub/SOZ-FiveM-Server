import { fetchNui } from '@public/nui/fetch';
import { NotificationPoliceType } from '@public/shared/notification';
import { SocietyMessage } from '@public/shared/phone/apps/society';
import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';
import { useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../shared/event/nui';
import { useNuiEvent } from '../../../../hook/nui';
import { useDynamicAlertConfig, useDynamicAlertDurationConfig, usePlaneMode } from '../../system/config/config.atom';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';
import { useEmergency } from '../../system/emergency/emergency.atom';
import { useNotifications } from '../../system/notifications/hooks/useNotifications';
import { usePhoneAvailable } from '../../system/phone.atom';
import { useRingtoneSound } from '../../system/sound/hooks/useRingtoneSound';
import { alerts } from './messages.constant';

const policeNumbers = ['555-POLICE', '555-BCSO', '555-SASP', '555-LSPD', '555-FBI', '555-LSCS'];

const messagesAtom = atom<Array<SocietyMessage>>([]);
const unTakenMessagesCountAtom = atom(
    get =>
        get(messagesAtom)
            ?.filter(m => !m.isTaken)
            ?.filter(m => !alerts.includes(m.info?.type))?.length ?? 0
);

export const useSocietyMessages = () => useAtomValue(messagesAtom);
export const useUnTakenMessagesCount = () => useAtomValue(unTakenMessagesCountAtom);

export const useSocietyMessagesStateHandlers = () => {
    const navigate = useNavigate();

    const available = usePhoneAvailable();
    const emergency = useEmergency();
    const planeMode = usePlaneMode();
    const dynamicAlert = useDynamicAlertConfig();
    const dynamicAlertDuration = useDynamicAlertDurationConfig();

    const notificationSound = useRingtoneSound('societyNotification', false);
    const dynamicSound = useRingtoneSound('dynamicAlert', false);
    const { addNotification } = useNotifications();

    const setMessages = useSetAtom(messagesAtom);

    const handleNewMessageAlert = (message: SocietyMessage) => {
        if (!available || emergency || planeMode || message.muted) return;

        if (policeNumbers.includes(message.conversation_id) && dynamicAlert === true) {
            fetchNui(NuiEvent.PoliceSendNotification, {
                ...message,
                info: { ...message.info, duration: dynamicAlertDuration },
            });
            dynamicSound.play();
        } else {
            addNotification(
                {
                    app: 'society-messages',
                    title: "Nouveau message d'entreprise",
                    content: message.message,
                    onClick: () => navigate('/society-messages'),
                },
                null
            );
            notificationSound.play();
        }
    };

    useNuiEvent('phone', 'AppSocietySetData', setMessages);
    useNuiEvent('phone', 'AppSocietyPatchData', (data: SocietyMessage) => {
        setMessages(prev => {
            const index = prev.findIndex(m => m.id === data.id);
            if (index === -1) {
                handleNewMessageAlert(data);
                return [data, ...prev];
            }

            const updated = [...prev];
            updated[index] = { ...prev[index], ...data, info: { ...prev[index].info, ...data.info } };
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
                    type: 'shooting' as NotificationPoliceType,
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
    const types: NotificationPoliceType[] = [
        'red-alert',
        'robbery',
        'vandalism',
        'racket',
        'shooting',
        'auto-theft',
        'drug',
        'explosion',
    ];
    return types[Math.floor(Math.random() * types.length)];
};
