import { Transition } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { ArchiveIcon, PhoneIcon, UserAddIcon } from '@heroicons/react/solid';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { Button } from '@ui/old_components/Button';
import cn from 'classnames';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useQueryParams } from '../../../common/hooks/useQueryParams';
import { useContact } from '../../../hooks/useContact';
import { useConfig } from '../../../hooks/usePhone';
import { useCall } from '../../../os/call/hooks/useCall';
import { useSnackbar } from '../../../os/snackbar/hooks/useSnackbar';
import { RootState, store } from '../../../store';
import { AppContent } from '../../../ui/components/AppContent';
import { useBackground } from '../../../ui/hooks/useBackground';
import MessageInput from '../components/form/MessageInput';
import { MessageBubble } from '../components/modal/MessageBubble';
import { MessageImageModal } from '../components/modal/MessageImageModal';
import { useMessageNotifications } from '../hooks/useMessageNotifications';

dayjs.extend(localizedFormat);

export const Messages = () => {
    const config = useConfig();
    const backgroundClass = useBackground();

    const navigate = useNavigate();
    const { groupId } = useParams<{ groupId: string }>();

    const query = useQueryParams();
    const referralImage = query?.image || null;

    const [t] = useTranslation();
    const { addAlert } = useSnackbar();
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const { removeNotification } = useMessageNotifications();

    const conversations = useSelector((state: RootState) => state.simCard.conversations);
    const conversation = useMemo(() => {
        const conv = conversations.find(conversation => conversation.conversation_id === groupId);

        if (!conv) {
            navigate('/messages');
            return addAlert({
                message: t('MESSAGES.FEEDBACK.FETCHED_MESSAGES_FAILED'),
                type: 'error',
            });
        }

        return conv;
    }, [conversations, groupId]);

    const messages = useSelector((state: RootState) => state.simCard.messages);
    const filteredMessages = useMemo(() => {
        const messagesByDate = [];
        messages
            .filter(conversation => conversation.conversation_id === groupId)
            .sort((a, b) => b.id - a.id)
            .forEach(message => {
                const date = dayjs(message.createdAt).locale('fr').format('LL');
                if (messagesByDate[date] === undefined) {
                    messagesByDate[date] = [];
                }
                messagesByDate[date].push(message);
            });
        return messagesByDate;
    }, [messages, groupId]);

    const { getDisplayByNumber } = useContact();
    const { initializeCall } = useCall();

    const handleAddContact = number => {
        return navigate(`/contacts/-1/?addNumber=${number}`);
    };

    const handleArchiveConversation = conversation_id => {
        store.dispatch.simCard.setConversationArchived(conversation_id);
        navigate(-1);
    };

    useEffect(() => {
        if (conversation) {
            store.dispatch.simCard.setConversationAsRead(conversation.conversation_id);
            removeNotification(conversation.conversation_id);
        }
    }, []);

    if (!conversation) {
        return null;
    }

    return (
        <Transition
            appear={true}
            show={true}
            className="absolute inset-x-0 z-40"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <AppWrapper>
                <AppTitle
                    title={getDisplayByNumber(conversation.phoneNumber) || conversation.phoneNumber}
                    maxTitleLengthBeforeDefiling={14}
                    action={
                        <div className="flex">
                            <ArchiveIcon
                                className="mx-2 h-6 w-6 cursor-pointer"
                                onClick={() => handleArchiveConversation(conversation.conversation_id)}
                            />
                            {getDisplayByNumber(conversation.phoneNumber) === conversation.phoneNumber && (
                                <Button className="mx-3">
                                    <UserAddIcon
                                        className="h-6 w-6 cursor-pointer"
                                        onClick={() => handleAddContact(conversation.phoneNumber)}
                                    />
                                </Button>
                            )}
                            <PhoneIcon
                                className="h-6 w-6 cursor-pointer"
                                onClick={() => initializeCall(conversation.phoneNumber)}
                            />
                        </div>
                    }
                >
                    <Link to={`/messages`} className="flex items-center text-base">
                        <ChevronLeftIcon className="h-5 w-5" /> Fermer
                    </Link>
                </AppTitle>
                <AppContent className="mt-8 mb-4 h-[800px] overflow-scroll">
                    <div style={{ flex: 1, display: 'flex', overflowY: 'auto' }}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 'min-content',
                                width: '100%',
                            }}
                        >
                            <div id="scrollableDiv" className="flex flex-col-reverse h-[650px] overflow-auto">
                                {Object.keys(filteredMessages).map(date => (
                                    <>
                                        {filteredMessages[date].map(message => (
                                            <MessageBubble key={message.id} message={message} />
                                        ))}

                                        <div key={date} className="relative">
                                            <div className="absolute inset-0 px-10 flex items-center">
                                                <div
                                                    className={cn('w-full border-t', {
                                                        'border-gray-300': config.theme.value === 'light',
                                                        'border-gray-600': config.theme.value === 'dark',
                                                    })}
                                                />
                                            </div>
                                            <div className="relative flex justify-center">
                                                <span
                                                    className={cn('px-2 text-xs', backgroundClass, {
                                                        'text-gray-400': config.theme.value === 'dark',
                                                        'text-gray-500': config.theme.value === 'light',
                                                    })}
                                                >
                                                    {date}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                    <MessageImageModal
                        image={referralImage}
                        onClose={() => setImageModalOpen(false)}
                        isOpen={imageModalOpen}
                        messageGroupId={conversation.conversation_id}
                    />
                    <MessageInput
                        messageGroupName={conversation?.display || conversation.phoneNumber}
                        messageConversationId={conversation.conversation_id}
                        onAddImageClick={() => setImageModalOpen(true)}
                    />
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
