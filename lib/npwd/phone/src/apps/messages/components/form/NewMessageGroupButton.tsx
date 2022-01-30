import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Add, Delete } from '@mui/icons-material';
import { useCheckedConversationsValue, useIsEditing } from '../../hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import {Box, IconButton} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '1.8rem',
    right: '1rem',
  },
}));

interface NewMessageGroupButtonProps {
  onClick(): void;
}

export const NewMessageGroupButton: React.FC<NewMessageGroupButtonProps> = ({ onClick }) => {
  const classes = useStyles();
  const checkedConversations = useCheckedConversationsValue();
  const [isEditing, setIsEditing] = useIsEditing();
  const { deleteConversation } = useMessageAPI();

  const handleDeleteConversations = () => {
    deleteConversation(checkedConversations);
    setIsEditing(false);
  };

  return (
      <Box className={classes.root}>
          <IconButton onClick={!isEditing ? onClick : handleDeleteConversations}>
              {!isEditing ? (
                  <Add color="primary"/>
              ) : (
                  <Delete color="primary"/>
              )}
          </IconButton>
      </Box>
  );
};

export default NewMessageGroupButton;
