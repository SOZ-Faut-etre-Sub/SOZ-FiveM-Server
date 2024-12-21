import {
    Contact,
    ContactDeleteDTO,
    ContactEvents,
    ContactSetFavoriteDTO,
    PreDBContact,
} from '../../../typings/contact';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import ContactService from './contacts.service';
import { contactsLogger } from './contacts.utils';

onNetPromise<void, Contact[]>(ContactEvents.GET_CONTACTS, (reqObj, resp) => {
    ContactService.handleFetchContacts(reqObj, resp).catch(e => {
        contactsLogger.error(`Error occured in fetch contacts event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<PreDBContact, Contact>(ContactEvents.ADD_CONTACT, (reqObj, resp) => {
    ContactService.handleAddContact(reqObj, resp).catch(e => {
        contactsLogger.error(`Error occured in add contacts event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<Contact, void>(ContactEvents.UPDATE_CONTACT, (reqObj, resp) => {
    ContactService.handleUpdateContact(reqObj, resp).catch(e => {
        contactsLogger.error(`Error occured in update contact event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<ContactDeleteDTO, void>(ContactEvents.DELETE_CONTACT, (reqObj, resp) => {
    ContactService.handleDeleteContact(reqObj, resp).catch(e => {
        contactsLogger.error(`Error occured in delete contact event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<ContactSetFavoriteDTO, void>(ContactEvents.SET_FAVORITE_CONTACT, (reqObj, resp) => {
    ContactService.handleSetFavoriteContact(reqObj, resp).catch(e => {
        contactsLogger.error(`Error occured in set contact favorite event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});
