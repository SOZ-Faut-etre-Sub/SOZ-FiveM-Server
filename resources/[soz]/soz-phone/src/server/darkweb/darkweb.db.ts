import {DarkwebConversation, DarkwebMessage, DarkwebParticipant} from '../../../typings/app/darkweb';

// not sure whats going on here.
export class _DarkwebDB {


    /**
     * Retrieve all message conversations associated with a user. This will
     * populate the list of message conversations on the UI
     */
    async getDarkwebMessage(messageId: number): Promise<DarkwebMessage> {
        return await exports.oxmysql.query_async(
            `SELECT DISTINCT darkweb_messages.id,
                             darkweb_messages.conversation_id,
                             darkweb_messages.message,
                             darkweb_messages.user_identifier,
                             darkweb_messages.phoneNumber,
                             unix_timestamp(darkweb_messages.createdAt) * 1000 as createdAt
             FROM darkweb_messages
             WHERE darkweb_messages.id = ?`,
            [messageId]
        );
    }

    /**
     * Retrieve all message conversations associated with a user. This will
     * populate the list of message conversations on the UI
     */
    async getDarkwebParticipant(conversationId: number, phoneNumber: string): Promise<DarkwebParticipant[]> {
        return await exports.oxmysql.query_async(
            `SELECT DISTINCT darkweb_participants.conversation_id,
                             darkweb_participants.user_identifier,
                             darkweb_participants.role,
                             darkweb_participants.masked,
                             darkweb_participants.unread,
                             darkweb_participants.phoneNumber,
                             darkweb_participants.notification,
                             unix_timestamp(darkweb_participants.joinedAt) * 1000 as joinedAt
             FROM darkweb_participants
             WHERE darkweb_participants.conversation_id = ?
               AND darkweb_participants.phoneNumber = ?`,
            [conversationId, phoneNumber]
        );
    }

    async addParticipant(
        conversation_id: number,
        user_identifier: string,
        role: string,
        phoneNumber: string
    ): Promise<any> {
        const id = await exports.oxmysql.insert_async(
            'INSERT INTO darkweb_participants (conversation_id, user_identifier, role, phoneNumber) VALUES (?, ?, ?, ?)',
            [conversation_id, user_identifier, role, phoneNumber]
        );
        return id;
    }

    async getDarkwebConversationParticipants(conversationId: number): Promise<DarkwebParticipant[]> {
        return await exports.oxmysql.query_async(
            `SELECT DISTINCT darkweb_participants.conversation_id,
                             darkweb_participants.user_identifier,
                             darkweb_participants.role,
                             darkweb_participants.masked,
                             darkweb_participants.unread,
                             darkweb_participants.phoneNumber,
                             darkweb_participants.notification,
                             unix_timestamp(darkweb_participants.joinedAt) * 1000 as joinedAt
             FROM darkweb_participants
             WHERE darkweb_participants.conversation_id = ?`,
            [conversationId]
        );
    }

    ///////////////////////////////////////////
    /**
     * Update a message group date
     * @param conversationId - the unique group ID this corresponds to
     */
    async updateMessageGroupDate(conversationId: string): Promise<void> {
        await exports.oxmysql.insert_async(
            'UPDATE phone_messages_conversations SET updatedAt = current_timestamp() WHERE conversation_id = ?',
            [conversationId]
        );
    }

    /**
     * Find a players identifier from their phone number
     * @param phoneNumber - the phone number to search for
     */
    async getIdentifierFromPhoneNumber(phoneNumber: string): Promise<string> {
        const result = await exports.oxmysql.query_async('SELECT citizenid FROM player WHERE charinfo LIKE ? LIMIT 1', [
            '%' + phoneNumber + '%',
        ]);

        return result.citizenid;
    }

}

const DarkwebDB = new _DarkwebDB();

export default DarkwebDB;
