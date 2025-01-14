import { ArchiveIcon, PencilAltIcon, PhoneIcon, UserAddIcon } from '@heroicons/react/solid';
import { NuiEvent } from '@public/shared/event/nui';
import clsx from 'clsx';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Message, Separator } from '../../../../../../shared/phone/simcard';
import { fetchNui } from '../../../../../fetch';
import { AppContent } from '../../../components/system/AppContent';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useBackgroundClasses } from '../../../hooks/useBackgroundClasses';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { useAppTitleActionsUpdater } from '../../../system/apps/hooks/useAppTitleActionsUpdater';
import { useAppTitleGetBackUpdater } from '../../../system/apps/hooks/useAppTitleGetBackUpdater';
import { useAppTitleUpdater } from '../../../system/apps/hooks/useAppTitleUpdater';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useNotifications } from '../../../system/notifications/hooks/useNotifications';
import { useContact } from '../../../system/sim-card/hooks/useContact';
import { useConversation } from '../../../system/sim-card/hooks/useConversation';
import { useMessages } from '../../../system/sim-card/hooks/useMessage';
import { deleteQueryFromLocation } from '../../../utils/deleteQueryFromLocation';
import { MessageBubble } from '../components/MessageBubble';
import { MessageInput } from '../components/MessageInput';
import { useConversationAPI } from '../hooks/useConversationAPI';
import { useMessageAPI } from '../hooks/useMessageAPI';

export const Messages = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const theme = useThemeConfig();

    const { conversationId } = useParams<{ conversationId: string }>();

    const query = useQueryParams();

    const { addNotification } = useNotifications();

    // const { removeNotification } = useMessageNotifications();

    const conversation = useConversation(conversationId);
    const messages = useMessages(conversationId);
    const contact = useContact(conversation?.phoneNumber);

    // const { initializeCall } = useCall();

    const { sendMessage } = useMessageAPI();
    const { archiveConversation } = useConversationAPI();

    const handleAddContact = number => navigate(`/contacts/-1/?addNumber=${number}`);
    const openContactInfo = () => navigate(`/contacts/${contact?.id}`);

    useEffect(() => {
        if (!conversation) return;

        fetchNui(NuiEvent.PhoneSimCardSetConversationAsRead, conversation.conversation_id);
        // removeNotification(conversation.conversation_id);
    }, []);

    useEffect(() => {
        if (!conversation) return;
        if (!query?.image) return;

        sendMessage({ conversation_id: conversation.conversation_id, message: query.image });
        navigate(pathname, { replace: true });
    }, [query]);

    useAppTitleGetBackUpdater(() => navigate('/messages'));
    useAppTitleUpdater(
        true,
        contact?.display ?? conversation?.phoneNumber,
        contact?.display ? conversation?.phoneNumber : undefined
    );
    useAppTitleActionsUpdater([
        {
            display: true,
            icon: <ArchiveIcon className="cursor-pointer size-5" />,
            onClick: () => archiveConversation(conversation),
        },
        {
            display: Boolean(contact),
            icon: <PencilAltIcon className="cursor-pointer size-5" />,
            onClick: () => openContactInfo(),
        },
        {
            display: !contact,
            icon: <UserAddIcon className="cursor-pointer size-5" />,
            onClick: () => handleAddContact(conversation?.phoneNumber),
        },
        {
            display: true,
            icon: <PhoneIcon className="cursor-pointer size-5" />,
            onClick: () => {}, //initializeCall(conversation.phoneNumber),
        },
    ]);

    return (
        <AppWrapper className="flex flex-col">
            <AppContent className="flex flex-col grow">
                <Virtuoso
                    className={clsx(
                        'grow scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
                        {
                            'scrollbar-thumb-white/80': theme === 'dark',
                            'scrollbar-thumb-black/20': theme === 'light',
                        }
                    )}
                    totalCount={messages.length}
                    data={messages}
                    itemContent={(index, data) => <MessageItem key={index} message={data} />}
                    initialTopMostItemIndex={messages.length - 1}
                />

                <MessageInput messageConversationId={conversation?.conversation_id} />
            </AppContent>
        </AppWrapper>
    );
};

const MessageItem: FunctionComponent<{ message: Message | Separator }> = ({ message }) => {
    const theme = useThemeConfig();

    const backgroundClass = useBackgroundClasses();

    if ('separator' in message) {
        return (
            <div className="relative">
                <div aria-hidden="true" className="absolute inset-0 flex items-center px-10">
                    <div
                        className={clsx('w-full border-t border-gray-300', {
                            'border-gray-300': theme === 'light',
                            'border-gray-600': theme === 'dark',
                        })}
                    />
                </div>
                <div className="relative flex justify-center">
                    <span
                        className={clsx('px-2 text-xs', backgroundClass, {
                            'text-gray-400': theme === 'dark',
                            'text-gray-500': theme === 'light',
                        })}
                    >
                        {message.display}
                    </span>
                </div>
            </div>
        );
    }

    return <MessageBubble message={message} />;
};
