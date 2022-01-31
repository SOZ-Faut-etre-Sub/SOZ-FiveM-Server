import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import { Button, ListItemAvatar, Avatar as MuiAvatar, List, ListItem } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import { SearchContacts } from './SearchContacts';
import { useHistory } from 'react-router-dom';
import LogDebugEvent from '../../../../os/debug/LogDebugEvents';
import { useFilteredContacts } from '../../hooks/state';
import { useCall } from '@os/call/hooks/useCall';
import EditIcon from '@mui/icons-material/Edit';

export const ContactList: React.FC = () => {
  const filteredContacts = useFilteredContacts();
  const history = useHistory();
  const { initializeCall } = useCall();

  const openContactInfo = (contactId: number) => {
    history.push(`/contacts/${contactId}`);
  };

  const startCall = (number: string) => {
    LogDebugEvent({
      action: 'Emitting `Start Call` to Scripts',
      level: 2,
      data: true,
    });
    initializeCall(number);
  };

  const handleMessage = (phoneNumber: string) => {
    LogDebugEvent({
      action: 'Routing to Message',
      level: 1,
      data: { phoneNumber },
    });
    history.push(`/messages/new?phoneNumber=${phoneNumber}`);
  };

  return (
    <>
      <SearchContacts />
      <List>
        {filteredContacts.map((contact) => (
          <ListItem key={contact.id} divider>
            <ListItemAvatar>
              {contact.avatar ? (
                <MuiAvatar src={contact.avatar} />
              ) : (
                <MuiAvatar>{contact.display.slice(0, 1).toUpperCase()}</MuiAvatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={contact.display}
              primaryTypographyProps={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
            <Button style={{ minWidth: 0, color: '#40cb56' }} onClick={() => startCall(contact.number)}>
              <PhoneIcon />
            </Button>
            <Button style={{ minWidth: 0, color: '#b4b4b4' }} onClick={() => handleMessage(contact.number)}>
              <ChatIcon />
            </Button>
            <Button style={{ minWidth: 0, color: '#ab5353' }} onClick={() => openContactInfo(contact.id)}>
              <EditIcon />
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
};
