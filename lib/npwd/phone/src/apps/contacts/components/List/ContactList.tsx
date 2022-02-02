import React from 'react';
import { SearchContacts } from './SearchContacts';
import { useHistory } from 'react-router-dom';
import LogDebugEvent from '../../../../os/debug/LogDebugEvents';
import { useFilteredContacts } from '../../hooks/state';
import { useCall } from '@os/call/hooks/useCall';
import {List} from "@ui/components/List";
import { ListItem } from '@ui/components/ListItem';

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
            {/*<ListItemAvatar>*/}
            {/*  {contact.avatar ? (*/}
            {/*    <MuiAvatar src={contact.avatar} />*/}
            {/*  ) : (*/}
            {/*    <MuiAvatar>{contact.display.slice(0, 1).toUpperCase()}</MuiAvatar>*/}
            {/*  )}*/}
            {/*</ListItemAvatar>*/}
            {/*<ListItemText*/}
            {/*  primary={contact.display}*/}
            {/*  primaryTypographyProps={{*/}
            {/*    overflow: 'hidden',*/}
            {/*    textOverflow: 'ellipsis',*/}
            {/*  }}*/}
            {/*/>*/}
            <button style={{ minWidth: 0, color: '#40cb56' }} onClick={() => startCall(contact.number)}>
              {/*<PhoneIcon />*/}
            </button>
            <button style={{ minWidth: 0, color: '#b4b4b4' }} onClick={() => handleMessage(contact.number)}>
              {/*<ChatIcon />*/}
            </button>
            <button style={{ minWidth: 0, color: '#ab5353' }} onClick={() => openContactInfo(contact.id)}>
              {/*<EditIcon />*/}
            </button>
          </ListItem>
        ))}
      </List>
    </>
  );
};
