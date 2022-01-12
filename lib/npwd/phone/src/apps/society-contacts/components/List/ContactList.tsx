import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import { Button, ListItemAvatar, Avatar as MuiAvatar, List, ListItem } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { SearchContacts } from './SearchContacts';
import { useHistory } from 'react-router-dom';
import { useFilteredContacts } from '../../hooks/state';

export const ContactList: React.FC = () => {
  const filteredContacts = useFilteredContacts();
  const history = useHistory();

  const openContactInfo = (contactId: number) => {
    history.push(`/society-contacts/${contactId}`);
  };

  return (
    <>
      <SearchContacts />
      <List>
        {filteredContacts.map((contact) => (
          <ListItem key={contact.id} divider>
            <ListItemAvatar>
              <MuiAvatar src={contact.avatar || ''} />
            </ListItemAvatar>
            <ListItemText
              primary={contact.display}
              primaryTypographyProps={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
            <Button onClick={() => openContactInfo(contact.id)}>
              <ExitToAppIcon />
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
};
