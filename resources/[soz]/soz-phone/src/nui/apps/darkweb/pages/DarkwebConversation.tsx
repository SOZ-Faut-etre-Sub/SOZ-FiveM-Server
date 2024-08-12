import { useQueryParams } from '@common/hooks/useQueryParams';
import { Transition } from '@headlessui/react';
import { ChevronLeftIcon, DotsVerticalIcon } from '@heroicons/react/solid';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { memo, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useDarkweb } from '../../../hooks/app/useDarkweb';
import { usePhoneNumber } from '../../../hooks/useSimCard';
import { store } from '../../../store';
import { DarkWebConversationSettingsModal } from '../components/DarkwebConversationSettingsModal';
import { DarkWebMessageBubble } from '../components/DarkwebMessageBubble';
import DarkWebInput from '../form/DarkwebInput';
import { UseDarkwebAPI } from '../hooks/useDarkwebApi';
import { DarkwebImageModal } from '../modal/DarkwebImageModal';

export const DarkWebConversation = memo(() => {
    const { getDarkwebConversation, getDarkwebConversationMessages, getDarkwebConversationParticipants } = useDarkweb();
    const { getMessages } = UseDarkwebAPI();
    const phoneNumber = usePhoneNumber();
    const { conversationId } = useParams<{ conversationId: string }>();

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
    const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string>('');

    const navigate = useNavigate();
    const conversation = getDarkwebConversation(conversationId);
    const participants = getDarkwebConversationParticipants(conversationId);
    const messages = getDarkwebConversationMessages(conversationId);

    const query = useQueryParams();
    const referralImage = query?.image || null;

    const blockTime =
        messages
            .filter(
                message => message.phoneNumber === phoneNumber && message.conversation_id === parseInt(conversationId)
            )
            .sort((a, b) => a.createdAt - b.createdAt)
            .reverse()[0]?.createdAt + 60_000;

    useEffect(() => {
        getMessages(conversation.id);
    }, []);

    useEffect(() => {
        const currentParticipant = participants?.find(participant => participant?.phoneNumber === phoneNumber);
        currentParticipant?.role && setUserRole(currentParticipant?.role);
    }, []);

    const filteredMessages = useMemo(() => {
        const messagesByDate = [];
        messages
            .sort((a, b) => b.id - a.id)
            .forEach(message => {
                const date = format(new Date(message.createdAt), 'PP', {
                    locale: fr,
                });

                if (messagesByDate[date] === undefined) {
                    messagesByDate[date] = [];
                }
                messagesByDate[date].push(message);
            });
        return messagesByDate;
    }, [messages]);

    useEffect(() => {
        if (conversation) {
            store.dispatch.appDarkweb.setConversationAsRead({ conversationId, phoneNumber });
        }
    }, []);

    return (
        <Transition
            appear={true}
            show={true}
            className="absolute inset-x-0 z-40 bg-transparent"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            {conversation && (
                <AppWrapper>
                    <AppTitle
                        title={conversation.label}
                        action={
                            <div className="flex gap-2.5 bg-transparent">
                                {userRole && userRole === 'ADMIN' && (
                                    <DotsVerticalIcon
                                        className="h-6 w-6 cursor-pointer text-teal-500"
                                        onClick={() => {
                                            setIsSettingsModalOpen(!isSettingsModalOpen);
                                        }}
                                    />
                                )}
                            </div>
                        }
                    >
                        <div
                            onClick={() => navigate(-1)}
                            className="flex items-end text-base cursor-pointer text-teal-500"
                        >
                            <ChevronLeftIcon className="h-5 w-5" /> <p>Retour</p>
                        </div>
                    </AppTitle>
                    <AppContent className="pb-0 px-0">
                        <div style={{ flex: 1, display: 'flex', overflowY: 'auto' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: 'min-content',
                                    width: '100%',
                                }}
                            >
                                <div
                                    id="scrollableDiv"
                                    className="flex flex-col-reverse h-[650px] overflow-auto scroll"
                                >
                                    {Object.keys(filteredMessages).map((date, id) => (
                                        <React.Fragment key={id}>
                                            {filteredMessages[date].map(message => (
                                                <DarkWebMessageBubble
                                                    key={message.id}
                                                    message={message}
                                                    participantRole={
                                                        (participants &&
                                                            participants.find(
                                                                participant =>
                                                                    participant.phoneNumber === message.phoneNumber
                                                            )?.role) ??
                                                        'USER'
                                                    }
                                                />
                                            ))}

                                            <div key={date} className="relative">
                                                <div className="absolute inset-0 px-10 flex items-center">
                                                    <div className={'w-full border-0 border-teal-500'} />
                                                </div>
                                                <div className="relative flex justify-center mt-8 text-teal-500">
                                                    <span className={'px-2 text-xs text-teal-500 font-bold'}>
                                                        {date}
                                                    </span>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DarkwebImageModal
                            image={referralImage}
                            onClose={() => setImageModalOpen(false)}
                            isOpen={imageModalOpen}
                            conversationId={conversation.id}
                        />
                        <DarkWebInput
                            darkwebConversationId={conversation.id}
                            onAddImageClick={() => setImageModalOpen(true)}
                            blockTime={blockTime}
                        />
                    </AppContent>
                    <DarkWebConversationSettingsModal
                        isOpen={isSettingsModalOpen}
                        onClose={() => {
                            setIsSettingsModalOpen(false);
                        }}
                        conversation={conversation}
                    />
                </AppWrapper>
            )}
            {!conversation && (
                <AppWrapper>
                    <AppTitle title={'Error'} action={<div className="flex gap-2.5"></div>}>
                        <div
                            onClick={() => navigate(-1)}
                            className="flex items-end text-base cursor-pointer text-teal-500"
                        >
                            <ChevronLeftIcon className="h-5 w-5" /> Fermer
                        </div>
                    </AppTitle>
                    <AppContent></AppContent>
                </AppWrapper>
            )}
        </Transition>
    );
});
