import React from 'react';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import MessageGroupItem from './MessageGroupItem';
import { SearchField } from '@ui/components/SearchField';
import { useTranslation } from 'react-i18next';
import {
  useCheckedConversations,
  useFilteredConversationsValue,
  useFilterValueState,
  useIsEditing,
} from '../../hooks/state';
import { List } from '@ui/components/List';

const MessagesList = (): any => {
  const [isEditing, setIsEditing] = useIsEditing();
  const [checkedConversation, setCheckedConversation] = useCheckedConversations();

  const [t] = useTranslation();

  const { conversations, goToConversation } = useMessages();

  const filteredConversations = useFilteredConversationsValue();
  const [searchValue, setSearchValue] = useFilterValueState();

  if (!conversations) return <p>No messages</p>;

  const handleClick = (conversation: MessageConversation) => () => {
    goToConversation(conversation);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleToggleConversation = (conversationId: string) => {
    const currentIndex = checkedConversation.indexOf(conversationId);
    const newChecked = [...checkedConversation];

    if (currentIndex === -1) {
      newChecked.push(conversationId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedConversation(newChecked);
  };

  return (
    <div>
      {!!conversations.length && (
        <div>
          {/*<IconButton onClick={toggleEdit}>*/}
          {/*  <EditIcon />*/}
          {/*</IconButton>*/}
        </div>
      )}
      <div>
        <SearchField
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={t('MESSAGES.SEARCH_PLACEHOLDER')}
        />
      </div>
      <div>
        <div >
          <List>
            {filteredConversations.map((conversation) => (
              <MessageGroupItem
                handleToggle={handleToggleConversation}
                isEditing={isEditing}
                checked={checkedConversation}
                key={conversation.conversation_id}
                messageConversation={conversation}
                handleClick={handleClick}
              />
            ))}
          </List>
        </div>
      </div>
    </div>
  );
};

export default MessagesList;
