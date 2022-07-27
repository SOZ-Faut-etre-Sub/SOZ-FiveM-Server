import { Transition } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { PhoneIcon, UserAddIcon } from '@heroicons/react/solid';
import { useCall } from '@os/call/hooks/useCall';
import { AppTitle } from '@ui/components/AppTitle';
import { AppWrapper } from '@ui/components/AppWrapper';
import { AppContent } from '@ui/old_components/AppContent';
import { Button } from '@ui/old_components/Button';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useMessagesState } from '../../hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import useMessages from '../../hooks/useMessages';
import Conversation, { CONVERSATION_ELEMENT_ID } from './Conversation';

const MINIMUM_LOAD_TIME = 600;

// abandon all hope ye who enter here
export const MessageModal = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { groupId } = useParams<{ groupId: string }>();
    const { activeMessageConversation, setActiveMessageConversation } = useMessages();
    const { fetchMessages } = useMessageAPI();
    const { initializeCall } = useCall();

    const { getContactByNumber, getDisplayByNumber } = useContactActions();
    const [messages, setMessages] = useMessagesState();

    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        fetchMessages(groupId, 0);
    }, [groupId, fetchMessages]);

    useEffect(() => {
        if (activeMessageConversation && messages) {
            setTimeout(() => {
                setLoaded(true);
            }, MINIMUM_LOAD_TIME);
            return;
        }
        setLoaded(false);
    }, [activeMessageConversation, messages]);

    const closeModal = () => {
        setMessages(null);
        navigate('/messages');
    };

    useEffect(() => {
        if (!groupId) return;
        setActiveMessageConversation(groupId);
    }, [groupId, setActiveMessageConversation]);

    useEffect(() => {
        if (isLoaded) {
            const element = document.getElementById(CONVERSATION_ELEMENT_ID);
            if (element) {
                element.scrollTop = element.scrollHeight;
            }
        }
    }, [isLoaded]);

    // We need to wait for the active conversation to be set.
    if (!activeMessageConversation) return <div>{/*<CircularProgress />*/}</div>;

    const handleAddContact = number => {
        const exists = getContactByNumber(number);
        const referal = encodeURIComponent(pathname);
        if (exists) {
            return navigate(`/contacts/${exists.id}/?referal=${referal}`);
        }
        return navigate(`/contacts/-1/?addNumber=${number}&referal=${referal}`);
    };

    const targetNumber = activeMessageConversation.phoneNumber;

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
                    title={
                        getDisplayByNumber(activeMessageConversation.phoneNumber) ||
                        activeMessageConversation.phoneNumber
                    }
                    isBigHeader={false}
                    action={
                        <div className="flex">
                            {getDisplayByNumber(targetNumber) === targetNumber && (
                                <Button className="mx-3">
                                    <UserAddIcon
                                        className="h-6 w-6 cursor-pointer"
                                        onClick={() => handleAddContact(targetNumber)}
                                    />
                                </Button>
                            )}
                            <PhoneIcon
                                className="h-6 w-6 cursor-pointer"
                                onClick={() => initializeCall(targetNumber)}
                            />
                        </div>
                    }
                >
                    <Button className="flex items-center text-base" onClick={closeModal}>
                        <ChevronLeftIcon className="h-5 w-5" /> Fermer
                    </Button>
                </AppTitle>
                <AppContent className="mt-8 mb-4 h-[800px] overflow-scroll">
                    {isLoaded && activeMessageConversation && (
                        <Conversation messages={messages} activeMessageGroup={activeMessageConversation} />
                    )}
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
