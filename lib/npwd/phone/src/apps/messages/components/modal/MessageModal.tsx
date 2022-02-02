import React, { useEffect, useState } from 'react';
import useMessages from '../../hooks/useMessages';
import Conversation, { CONVERSATION_ELEMENT_ID } from './Conversation';
import MessageSkeletonList from './MessageSkeletonList';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useMessagesState } from '../../hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { useCall } from '@os/call/hooks/useCall';
import { Button } from '@ui/components/Button';

const LARGE_HEADER_CHARS = 30;
const MAX_HEADER_CHARS = 80;
const MINIMUM_LOAD_TIME = 600;

// abandon all hope ye who enter here
export const MessageModal = () => {
  const [t] = useTranslation();
  const history = useHistory();
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
  let header =
    getDisplayByNumber(activeMessageConversation.phoneNumber) ||
    activeMessageConversation.phoneNumber;
  const truncatedHeader = `${header.slice(0, MAX_HEADER_CHARS).trim()}...`;
  header = header.length > MAX_HEADER_CHARS ? truncatedHeader : header;

  const headerClass =
    header.length > LARGE_HEADER_CHARS ? 'classes.largeGroupDisplay' : 'classes.groupdisplay';

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
    <>
      <div >
        <div
        >
          <div >
            <button onClick={closeModal}>
              {/*<ArrowBackIosIcon fontSize="large" />*/}
            </button>
            <div className={headerClass}>
              {header}
            </div>
            <div
              title={`${t('GENERIC.CALL')} ${targetNumber}`}
            >
              {/*<IconButton onClick={() => initializeCall(targetNumber)}>*/}
              {/*  <Call fontSize="medium" />*/}
              {/*</IconButton>*/}
            </div>
            {getDisplayByNumber(targetNumber) === targetNumber ? (
              <Button>
                {/*<PersonAddIcon onClick={() => handleAddContact(targetNumber)} fontSize="large" />*/}
              </Button>
            ) : null}
          </div>
          {isLoaded && activeMessageConversation ? (
            <Conversation messages={messages} activeMessageGroup={activeMessageConversation} />
          ) : (
            <MessageSkeletonList />
          )}
        </div>
      </div>
    </>
  );
};
