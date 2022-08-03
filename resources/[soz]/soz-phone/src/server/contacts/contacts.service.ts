import { Contact, ContactDeleteDTO, ContactEvents, PreDBContact } from '../../../typings/contact';
import { MessageEvents } from '../../../typings/messages';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import ContactsDB, { _ContactsDB } from './contacts.db';
import { contactsLogger } from './contacts.utils';

class _ContactService {
    private readonly contactsDB: _ContactsDB;

    constructor() {
        this.contactsDB = ContactsDB;
        contactsLogger.debug('Contacts service started');
    }

    formatPhoneNumber(phone: string) {
        const numbers = phone.match(/(555)-?(\d{4})/);
        return `${numbers[1]}-${numbers[2]}`;
    }

    async handleUpdateContact(reqObj: PromiseRequest<Contact>, resp: PromiseEventResp<void>): Promise<void> {
        const identifier = PlayerService.getIdentifier(reqObj.source);
        try {
            reqObj.data.number = this.formatPhoneNumber(reqObj.data.number);
            await this.contactsDB.updateContact(reqObj.data, identifier);

            emitNet(ContactEvents.UPDATE_CONTACT_SUCCESS, reqObj.source, reqObj.data);

            resp({ status: 'ok' });
        } catch (e) {
            contactsLogger.error(`Error in handleUpdateContact (${identifier}), ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }
    async handleDeleteContact(reqObj: PromiseRequest<ContactDeleteDTO>, resp: PromiseEventResp<void>): Promise<void> {
        const identifier = PlayerService.getIdentifier(reqObj.source);
        try {
            await this.contactsDB.deleteContact(reqObj.data.id, identifier);

            emitNet(ContactEvents.DELETE_CONTACT_SUCCESS, reqObj.source, reqObj.data.id);

            resp({ status: 'ok' });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
            contactsLogger.error(`Error in handleDeleteContact (${identifier}), ${e.toString()}`);
        }
    }
    async handleAddContact(reqObj: PromiseRequest<PreDBContact>, resp: PromiseEventResp<Contact>): Promise<void> {
        const identifier = PlayerService.getIdentifier(reqObj.source);
        try {
            reqObj.data.number = this.formatPhoneNumber(reqObj.data.number);
            const contact = await this.contactsDB.addContact(identifier, reqObj.data);

            emitNet(ContactEvents.ADD_CONTACT_SUCCESS, reqObj.source, contact);

            resp({ status: 'ok', data: contact });
        } catch (e) {
            contactsLogger.error(`Error in handleAddContact, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async handleFetchContacts(reqObj: PromiseRequest, resp: PromiseEventResp<Contact[]>): Promise<void> {
        const identifier = PlayerService.getIdentifier(reqObj.source);
        try {
            const contacts = await this.contactsDB.fetchAllContacts(identifier);
            resp({ status: 'ok', data: contacts });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
            contactsLogger.error(`Error in handleFetchContact (${identifier}), ${e.toString()}`);
        }
    }
}

const ContactService = new _ContactService();
export default ContactService;
