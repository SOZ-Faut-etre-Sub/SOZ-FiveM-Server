import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import {ListItemAvatar, Avatar as MuiAvatar, List, ListItem, Divider} from '@mui/material';
import {SearchContacts} from './SearchContacts';
import {useHistory} from 'react-router-dom';
import {useFilteredContacts} from '../../hooks/state';

export const ContactList: React.FC = () => {
    const filteredContacts = useFilteredContacts();
    const history = useHistory();

    const openContactInfo = (contactId: number) => {
        history.push(`/society-contacts/${contactId}`);
    };

    return (
        <>
            <SearchContacts/>
            <List>
                {filteredContacts.map((contact, id) => (
                    <>
                        <ListItem style={{cursor: 'pointer'}} key={contact.id} onClick={() => openContactInfo(contact.id)}>
                            <ListItemAvatar>
                                <MuiAvatar src={contact.avatar || ''}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={contact.display}
                                primaryTypographyProps={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            />
                        </ListItem>
                        {filteredContacts.length - 1 !== id && <Divider component="li"/>}
                    </>
                ))}
            </List>
        </>
    );
};
