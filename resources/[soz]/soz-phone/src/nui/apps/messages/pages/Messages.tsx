import { Transition } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { PhoneIcon, UserAddIcon } from '@heroicons/react/solid';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { Button } from '@ui/old_components/Button';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useQueryParams } from '../../../common/hooks/useQueryParams';
import { useContact } from '../../../hooks/useContact';
import { useCall } from '../../../os/call/hooks/useCall';
import { RootState } from '../../../store';
import { AppContent } from '../../../ui/components/AppContent';
import MessageInput from '../components/form/MessageInput';
import { MessageBubble } from '../components/modal/MessageBubble';
import { MessageImageModal } from '../components/modal/MessageImageModal';

export const Messages = () => {
    const navigate = useNavigate();
    const { groupId } = useParams<{ groupId: string }>();

    const query = useQueryParams();
    const referralImage = query?.image || null;

    const [imageModalOpen, setImageModalOpen] = useState(false);

    const conversations = useSelector((state: RootState) => state.simCard.conversations);
    const conversation = useMemo(() => {
        return conversations.find(conversation => conversation.conversation_id === groupId);
    }, [conversations, groupId]);

    const messages = useSelector((state: RootState) => state.simCard.messages);
    const filteredMessages = useMemo(() => {
        console.log('filteredMessages', messages);
        return messages.filter(conversation => conversation.conversation_id === groupId);
    }, [messages, groupId]);

    const { getDisplayByNumber } = useContact();
    const { initializeCall } = useCall();

    const handleAddContact = number => {
        return navigate(`/contacts/-1/?addNumber=${number}`);
    };

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
                    action={
                        <div className="flex">
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
                            <div id="scrollableDiv" className="flex flex-col-reverse h-[675px] overflow-auto">
                                {filteredMessages.map(message => (
                                    <MessageBubble key={message.id} message={message} />
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
