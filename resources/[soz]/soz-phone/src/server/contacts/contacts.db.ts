import { Contact, PreDBContact } from '../../../typings/contact';

export class _ContactsDB {
    async fetchAllContacts(identifier: string): Promise<Contact[]> {
        return await exports.oxmysql.query_async(
            'SELECT phone_contacts.*, phone_profile.avatar as avatar' +
                ' FROM phone_contacts' +
                ' LEFT JOIN phone_profile ON phone_contacts.number = phone_profile.number' +
                ' WHERE identifier = ? ORDER BY display ASC',
            [identifier]
        );
    }

    async addContact(identifier: string, { display, number }: PreDBContact): Promise<Contact> {
        const id = exports.oxmysql.insert_async(
            'INSERT INTO phone_contacts (identifier, number, display) VALUES (?, ?, ?)',
            [identifier, number, display]
        );

        return {
            id,
            number,
            display,
        };
    }

    async updateContact(contact: Contact, identifier: string): Promise<any> {
        exports.oxmysql.update_async(
            'UPDATE phone_contacts SET number = ?, display = ? WHERE id = ? AND identifier = ?',
            [contact.number, contact.display, contact.id, identifier]
        );
    }

    async deleteContact(contactId: number, identifier: string): Promise<void> {
        exports.oxmysql.update_async('DELETE FROM phone_contacts WHERE id = ? AND identifier = ?', [
            contactId,
            identifier,
        ]);
    }
}

const ContactsDB = new _ContactsDB();
export default ContactsDB;
