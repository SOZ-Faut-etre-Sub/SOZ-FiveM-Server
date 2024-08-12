import { DarkwebConversation, DarkwebMessage, DarkwebParticipant } from '../../../typings/app/darkweb';

// not sure whats going on here.
export class _DarkwebDB {
    /**
     * Create a message in the database
     * @param author - the phoneNumber to the player who sent the message
     * @param conversationId - the message conversation ID to attach this message to
     * @param message - content of the message
     */
    async sendMessage(
        userIdentifier: string,
        phoneNumber: string,
        conversationId: number,
        message: string
    ): Promise<number> {
        const id = await exports.oxmysql.insert_async(
            'INSERT INTO darkweb_messages (user_identifier, phoneNumber, message, conversation_id) VALUES (?, ?, ?, ?)',
            [userIdentifier, phoneNumber, message, conversationId]
        );

        return id;
    }

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
                             unix_timestamp(darkweb_messages.createdAt)*1000 as createdAt
                       FROM darkweb_messages
                       WHERE darkweb_messages.id = ?`,
            [messageId]
        );
    }

    // Not sure if we're going to query this exactly as its done here.
    /**
     * Retrieve all message conversations associated with a user. This will
     * populate the list of message conversations on the UI
     */
    async getDarkwebConversations(): Promise<DarkwebConversation[]> {
        return await exports.oxmysql.query_async(
            `SELECT DISTINCT darkweb_conversations.id,
                             darkweb_conversations.user_identifier,
                             darkweb_conversations.label,
                             darkweb_conversations.createdAt,
                             darkweb_conversations.unread,
                             darkweb_conversations.masked,
                             darkweb_conversations.password,
                             unix_timestamp(darkweb_conversations.updatedAt)*1000 as updatedAt
             FROM darkweb_conversations
             WHERE updatedAt >= DATE_SUB(NOW(), INTERVAL 14 DAY)
             ORDER BY darkweb_conversations.updatedAt DESC`,
            []
        );
    }

    /**
     * Retrieve all message conversations associated with a user. This will
     * populate the list of message conversations on the UI
     */
    async getDarkwebParticipants(): Promise<DarkwebParticipant[]> {
        return await exports.oxmysql.query_async(
            `SELECT DISTINCT darkweb_participants.conversation_id,
                                 darkweb_participants.user_identifier,
                                 darkweb_participants.role,
                                 darkweb_participants.masked,
                                 darkweb_participants.phoneNumber,
                                 darkweb_participants.notification,
                                 darkweb_participants.unread,
                                 unix_timestamp(darkweb_participants.joinedAt)*1000 as joinedAt
                 FROM darkweb_participants`,
            []
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
                                     unix_timestamp(darkweb_participants.joinedAt)*1000 as joinedAt
                     FROM darkweb_participants
                     WHERE darkweb_participants.conversation_id = ? 
                     AND darkweb_participants.phoneNumber = ?`,
            [conversationId, phoneNumber]
        );
    }

    async getDarkwebMessages(conversationId: number): Promise<DarkwebMessage[]> {
        return await exports.oxmysql.query_async(
            `SELECT DISTINCT darkweb_messages.id,
                             darkweb_messages.conversation_id,
                             darkweb_messages.message,
                             darkweb_messages.user_identifier,
                             darkweb_messages.phoneNumber,
                             unix_timestamp(darkweb_messages.createdAt)*1000 as createdAt
                       FROM darkweb_messages
                       Where darkweb_messages.conversation_id = ?
                       ORDER BY id DESC`,
            [conversationId]
        );
    }

    async createDarkwebConversation(userIdentifier: string, password: string, label: string): Promise<number> {
        const id = await exports.oxmysql.insert_async(
            'INSERT INTO darkweb_conversations (user_identifier, password, label) VALUES (?, ?, ?)',
            [userIdentifier, password, label]
        );
        return id;
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

    async getDarkwebConversation(conversationId: number): Promise<DarkwebConversation> {
        const conversations = await exports.oxmysql.query_async(
            `SELECT DISTINCT darkweb_conversations.id,
                             darkweb_conversations.user_identifier,
                             darkweb_conversations.label,
                             darkweb_conversations.createdAt,
                             darkweb_conversations.unread,
                             darkweb_conversations.masked,
                             darkweb_conversations.password,
                             unix_timestamp(darkweb_conversations.updatedAt)*1000 as updatedAt
             FROM darkweb_conversations
             WHERE darkweb_conversations.id = ?`,
            [conversationId]
        );
        return conversations[0];
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
                             unix_timestamp(darkweb_participants.joinedAt)*1000 as joinedAt
                 FROM darkweb_participants
                WHERE darkweb_participants.conversation_id = ?`,
            [conversationId]
        );
    }

    async updateDarkwebConversationParticipant(
        role: string,
        phoneNumber: string,
        conversationId: number
    ): Promise<any> {
        const id = await exports.oxmysql.query_async(
            `UPDATE darkweb_participants SET role = ? WHERE darkweb_participants.conversation_id = ? AND darkweb_participants.phoneNumber = ?`,
            [role, conversationId, phoneNumber]
        );
        return id;
    }

    async archiveConversation(conversationId: number): Promise<any> {
        return await exports.oxmysql.query_async(
            `UPDATE darkweb_conversations SET masked = 1 WHERE darkweb_conversations.id = ?`,
            [conversationId]
        );
    }

    async updateConversation(conversationId: number, label: string, password: string): Promise<any> {
        return await exports.oxmysql.query_async(
            `UPDATE darkweb_conversations SET label = ?, password = ? WHERE darkweb_conversations.id = ?`,
            [label, password, conversationId]
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

    /**
     * Sets the current message isRead to 0 for said player
     * @param conversation_id The unique group ID for the message
     * @param phoneNumber The identifier for the player
     */
    async setMessageUnread(conversation_id: number, phoneNumber: string, status: boolean) {
        await exports.oxmysql.query_async(
            `UPDATE darkweb_participants SET unread = ? WHERE conversation_id = ? AND phoneNumber = ?`,
            [status, conversation_id, phoneNumber]
        );
    }
}

const DarkwebDB = new _DarkwebDB();

export default DarkwebDB;
