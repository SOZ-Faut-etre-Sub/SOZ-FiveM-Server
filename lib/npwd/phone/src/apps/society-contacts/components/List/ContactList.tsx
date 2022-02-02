import React from 'react';
import {SearchContacts} from './SearchContacts';
import {useHistory} from 'react-router-dom';
import {useFilteredContacts} from '../../hooks/state';
import { List } from '@ui/components/List';
import {ListItem} from "@ui/components/ListItem";

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

                        </ListItem>
                        {filteredContacts.length - 1 !== id && <div />}
                    </>
                ))}
            </List>
        </>
    );
};
