import { Contact, PreDBContact } from '../../../typings/contact';
import { ResultSetHeader } from 'mysql2';
import DbInterface from '../db/db_wrapper';

export class _ContactsDB {
  async fetchAllContacts(identifier: string): Promise<Contact[]> {
    const query = `SELECT phone_contacts.*, phone_profile.avatar as avatar
                   FROM phone_contacts
                   LEFT JOIN phone_profile ON phone_contacts.number = phone_profile.number
                   WHERE identifier = ? ORDER BY display ASC`;
    const [results] = await DbInterface._rawExec(query, [identifier]);
    return <Contact[]>results;
  }

  async addContact(
    identifier: string,
    { display, number }: PreDBContact,
  ): Promise<Contact> {
    const query =
      'INSERT INTO phone_contacts (identifier, number, display) VALUES (?, ?, ?)';

    const [setResult] = await DbInterface._rawExec(query, [identifier, number, display]);

    return {
      id: (<ResultSetHeader>setResult).insertId,
      number,
      display,
    };
  }

  async updateContact(contact: Contact, identifier: string): Promise<any> {
    const query =
      'UPDATE phone_contacts SET number = ?, display = ? WHERE id = ? AND identifier = ?';
    await DbInterface._rawExec(query, [
      contact.number,
      contact.display,
      contact.id,
      identifier,
    ]);
  }

  async deleteContact(contactId: number, identifier: string): Promise<void> {
    const query = 'DELETE FROM phone_contacts WHERE id = ? AND identifier = ?';
    await DbInterface._rawExec(query, [contactId, identifier]);
  }
}

const ContactsDB = new _ContactsDB();
export default ContactsDB;
