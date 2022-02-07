import React, {useEffect, useState} from 'react';
import useMessages from '../../hooks/useMessages';
import Conversation, {CONVERSATION_ELEMENT_ID} from './Conversation';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useContactActions} from '../../../contacts/hooks/useContactActions';
import {useMessagesState} from '../../hooks/state';
import {useMessageAPI} from '../../hooks/useMessageAPI';
import {useCall} from '@os/call/hooks/useCall';
import {Button} from '@ui/components/Button';
import {Transition} from '@headlessui/react';
import {AppTitle} from "@ui/components/AppTitle";
import {ChevronLeftIcon} from "@heroicons/react/outline";
import {AppContent} from "@ui/components/AppContent";
import {PhoneIcon, PhoneOutgoingIcon, TrashIcon, UserAddIcon} from "@heroicons/react/solid";
import {AppWrapper} from "@ui/components";
import conversation from "./Conversation";

const LARGE_HEADER_CHARS = 30;
const MAX_HEADER_CHARS = 80;
const MINIMUM_LOAD_TIME = 600;

// abandon all hope ye who enter here
export const MessageModal = () => {
    const [t] = useTranslation();
    const history = useHistory();
    const {pathname} = useLocation();
    const {groupId} = useParams<{ groupId: string }>();
    const {activeMessageConversation, setActiveMessageConversation} = useMessages();
    const {fetchMessages, deleteConversation} = useMessageAPI();
    const {initializeCall} = useCall();

    const {getContactByNumber, getDisplayByNumber} = useContactActions();
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
        history.push('/messages');
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
    if (!activeMessageConversation)
        return (
            <div>
                {/*<CircularProgress />*/}
            </div>
        );

    // don't allow too many characters, it takes too much room
    let header = getDisplayByNumber(activeMessageConversation.phoneNumber) ||
        activeMessageConversation.phoneNumber;
    const truncatedHeader = `${header.slice(0, MAX_HEADER_CHARS).trim()}...`;
    header = header.length > MAX_HEADER_CHARS ? truncatedHeader : header;

    const handleAddContact = (number) => {
        const exists = getContactByNumber(number);
        const referal = encodeURIComponent(pathname);
        if (exists) {
            return history.push(`/contacts/${exists.id}/?referal=${referal}`);
        }
        return history.push(`/contacts/-1/?addNumber=${number}&referal=${referal}`);
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
                <AppTitle title={header} isBigHeader={false} action={
                    <div className="flex">
                        <Button className="mx-3">
                            <TrashIcon className="h-6 w-6 text-red-500 cursor-pointer"
                                       onClick={() => deleteConversation([activeMessageConversation.conversation_id])}/>
                        </Button>
                        {getDisplayByNumber(targetNumber) === targetNumber &&
                            <Button className="mx-3">
                                <UserAddIcon className="h-6 w-6 cursor-pointer" onClick={() => handleAddContact(targetNumber)}/>
                            </Button>
                        }
                        <PhoneIcon className="h-6 w-6 cursor-pointer" onClick={() => initializeCall(targetNumber)}/>
                    </div>

                }>
                    <Button className="flex items-center text-base" onClick={closeModal}>
                        <ChevronLeftIcon className="h-5 w-5"/> Fermer
                    </Button>
                </AppTitle>
                <AppContent className="mt-8 mb-4 h-[800px] overflow-scroll">
                    {isLoaded && activeMessageConversation &&
                        <Conversation messages={messages} activeMessageGroup={activeMessageConversation}/>
                    }
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
