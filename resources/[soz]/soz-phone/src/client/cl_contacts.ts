import { ContactEvents, PreDBContact } from '../../typings/contact';
import { sendContactsEvent } from '../utils/messages';
import { RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(ContactEvents.GET_CONTACTS);
RegisterNuiProxy(ContactEvents.ADD_CONTACT);
RegisterNuiProxy(ContactEvents.UPDATE_CONTACT);
RegisterNuiProxy(ContactEvents.DELETE_CONTACT);

onNet(ContactEvents.ADD_CONTACT_SUCCESS, (contactDto: PreDBContact) => {
    sendContactsEvent(ContactEvents.ADD_CONTACT_SUCCESS, contactDto);
});

onNet(ContactEvents.UPDATE_CONTACT_SUCCESS, (contactDto: PreDBContact) => {
    sendContactsEvent(ContactEvents.UPDATE_CONTACT_SUCCESS, contactDto);
});

onNet(ContactEvents.DELETE_CONTACT_SUCCESS, (contactId: number) => {
    sendContactsEvent(ContactEvents.DELETE_CONTACT_SUCCESS, contactId);
});
