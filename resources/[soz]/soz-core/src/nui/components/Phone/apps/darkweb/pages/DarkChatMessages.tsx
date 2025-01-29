import { DotsVerticalIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { FunctionComponent, memo, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { DarkwebMessage } from '../../../../../../shared/phone/apps/darkweb';
import { Message, Separator } from '../../../../../../shared/phone/simcard';
import { AppContent } from '../../../components/system/AppContent';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useBackgroundClasses } from '../../../hooks/useBackgroundClasses';
import { useAppTitleActionsUpdater } from '../../../system/apps/hooks/useAppTitleActionsUpdater';
import { useAppTitleGetBackUpdater } from '../../../system/apps/hooks/useAppTitleGetBackUpdater';
import { useAppTitleUpdater } from '../../../system/apps/hooks/useAppTitleUpdater';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useSimCard } from '../../../system/sim-card/hooks/useSimCard';
import { DarkWebConversationSettingsModal } from '../components/DarkwebConversationSettingsModal';
import DarkWebInput from '../components/DarkwebInput';
import { DarkWebMessageBubble } from '../components/DarkwebMessageBubble';
import { useConversation } from '../hooks/useConversations';
import { useDarkWebAPI } from '../hooks/useDarkwebApi';
import { useMessages } from '../hooks/useMessages';
import { useParticipant } from '../hooks/useParticipants';

export const DarkChatMessages = memo(() => {
    const navigate = useNavigate();
    const theme = useThemeConfig();

    const { conversationId } = useParams<{ conversationId: string }>();

    const { setConversationAsRead, fetchMessages } = useDarkWebAPI();
    const { number } = useSimCard();

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

    const conversation = useConversation(conversationId);
    const participant = useParticipant(number);
    const messages = useMessages(conversationId);

    const blockTime =
        messages
            .filter(message => message.phoneNumber === number && message.conversation_id === parseInt(conversationId))
            .sort((a, b) => a.createdAt - b.createdAt)
            .reverse()[0]?.createdAt + 60_000;

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

    useAppTitleGetBackUpdater(() => navigate(-1));
    useAppTitleUpdater(true, conversation?.label || 'Erreur');
    useAppTitleActionsUpdater([
        {
            display: participant?.role === 'ADMIN',
            icon: <DotsVerticalIcon className="text-teal-500 size-5" />,
            onClick: () => setIsSettingsModalOpen(!isSettingsModalOpen),
        },
    ]);

    useEffect(() => {
        if (!conversation) return;

        fetchMessages(conversation.id);
        setConversationAsRead(conversation.id);
    }, []);

    return (
        <AppWrapper>
            <AppContent>
                <Virtuoso
                    style={{
                        height: 760,
                    }}
                    className={clsx(
                        'scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
                        {
                            'scrollbar-thumb-white/80': theme === 'dark',
                            'scrollbar-thumb-black/20': theme === 'light',
                        }
                    )}
                    totalCount={messages.length}
                    data={messages}
                    itemContent={(index, data) => <MessageItem key={index} message={data} />}
                    initialTopMostItemIndex={messages.length - 1}
                    increaseViewportBy={740}
                />
                {/*<div id="scrollableDiv" className="flex flex-col-reverse h-[650px] overflow-auto scroll">*/}
                {/*    {Object.keys(filteredMessages).map((date, id) => (*/}
                {/*        <React.Fragment key={id}>*/}
                {/*            {filteredMessages[date].map(message => (*/}
                {/*                <DarkWebMessageBubble*/}
                {/*                    key={message.id}*/}
                {/*                    message={message}*/}
                {/*                    participantRole={*/}
                {/*                        (participants &&*/}
                {/*                            participants.find(*/}
                {/*                                participant => participant.phoneNumber === message.phoneNumber*/}
                {/*                            )?.role) ??*/}
                {/*                        'USER'*/}
                {/*                    }*/}
                {/*                />*/}
                {/*            ))}*/}

                {/*            <div key={date} className="relative">*/}
                {/*                <div className="absolute inset-0 px-10 flex items-center">*/}
                {/*                    <div className={'w-full border-0 border-teal-500'} />*/}
                {/*                </div>*/}
                {/*                <div className="relative flex justify-center mt-8 text-teal-500">*/}
                {/*                    <span className={'px-2 text-xs text-teal-500 font-bold'}>{date}</span>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </React.Fragment>*/}
                {/*    ))}*/}
                {/*</div>*/}

                <DarkWebInput darkwebConversationId={conversation.id} blockTime={blockTime} autoFocus />
                <DarkWebConversationSettingsModal
                    isOpen={isSettingsModalOpen}
                    onClose={() => {
                        setIsSettingsModalOpen(false);
                    }}
                    conversation={conversation}
                />
            </AppContent>
        </AppWrapper>
    );
});

const MessageItem: FunctionComponent<{ message: DarkwebMessage }> = ({ message }) => {
    const theme = useThemeConfig();

    const backgroundClass = useBackgroundClasses();

    const participant = useParticipant(message?.phoneNumber);

    // if ('separator' in message) {
    //     return (
    //         <div className="relative">
    //             <div aria-hidden="true" className="absolute inset-0 flex items-center px-10">
    //                 <div
    //                     className={clsx('w-full border-t border-gray-300', {
    //                         'border-gray-300': theme === 'light',
    //                         'border-gray-600': theme === 'dark',
    //                     })}
    //                 />
    //             </div>
    //             <div className="relative flex justify-center">
    //                 <span
    //                     className={clsx('px-2 text-xs', backgroundClass, {
    //                         'text-gray-400': theme === 'dark',
    //                         'text-gray-500': theme === 'light',
    //                     })}
    //                 >
    //                     {message.display}
    //                 </span>
    //             </div>
    //         </div>
    //     );
    // }

    return <DarkWebMessageBubble message={message} participantRole={participant?.role ?? 'USER'} />;
};
