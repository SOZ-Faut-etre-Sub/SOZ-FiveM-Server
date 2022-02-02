import React from 'react';
import { useCheckedConversationsValue, useIsEditing } from '../../hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';


interface NewMessageGroupButtonProps {
  onClick(): void;
}

export const NewMessageGroupButton: React.FC<NewMessageGroupButtonProps> = ({ onClick }) => {
  const checkedConversations = useCheckedConversationsValue();
  const [isEditing, setIsEditing] = useIsEditing();
  const { deleteConversation } = useMessageAPI();

  const handleDeleteConversations = () => {
    deleteConversation(checkedConversations);
    setIsEditing(false);
  };

  return (
      <div >
          {/*<IconButton onClick={!isEditing ? onClick : handleDeleteConversations}>*/}
          {/*    {!isEditing ? (*/}
          {/*        <Add color="primary"/>*/}
          {/*    ) : (*/}
          {/*        <Delete color="primary"/>*/}
          {/*    )}*/}
          {/*</IconButton>*/}
      </div>
  );
};

export default NewMessageGroupButton;
