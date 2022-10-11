import { Message, UnformattedMessageConversation } from '../../../typings/messages';

// not sure whats going on here.
export class _MessagesDB {
    /**
     * Create a message in the database
     * @param author - the phoneNumber to the player who sent the message
     * @param conversationId - the message conversation ID to attach this message to
     * @param message - content of the message
     */
    async createMessage(
        userIdentifier: string,
        author: string,
        conversationId: string,
        message: string
    ): Promise<number> {
        const id = await exports.oxmysql.insert_async(
            'INSERT INTO phone_messages (user_identifier, author, message, conversation_id) VALUES (?, ?, ?, ?)',
            [userIdentifier, author, message, conversationId]
        );

        await exports.oxmysql.update_async(
            'UPDATE phone_messages_conversations SET masked = 0, updatedAt = current_timestamp(), unread = unread + 1 WHERE conversation_id = ?',
            [conversationId]
        );

        return id;
    }

    // Not sure if we're going to query this exactly as its done here.
    /**
     * Retrieve all message conversations associated with a user. This will
     * populate the list of message conversations on the UI
     * @param phoneNumber - phoneNumber of the user to get message conversations for
     */
    async getMessageConversations(phoneNumber: string): Promise<UnformattedMessageConversation[]> {
        return await exports.oxmysql.query_async(
            `SELECT DISTINCT phone_messages_conversations.unread,
                   phone_messages_conversations.conversation_id,
                   phone_messages_conversations.masked,
                   phone_messages_conversations.user_identifier,
                   phone_messages_conversations.participant_identifier,
                   phone_profile.avatar,
                   JSON_VALUE(player.charinfo,'$.phone') AS phone_number,
                   unix_timestamp(phone_messages_conversations.updatedAt)*1000 as updatedAt
            FROM (SELECT conversation_id
                  FROM phone_messages_conversations
                  WHERE phone_messages_conversations.participant_identifier = ?) AS t
                     LEFT OUTER JOIN phone_messages_conversations
                                     ON phone_messages_conversations.conversation_id = t.conversation_id
                     LEFT OUTER JOIN phone_profile
                                     ON phone_profile.number = phone_messages_conversations.participant_identifier
                     LEFT OUTER JOIN player
                                     ON JSON_VALUE(player.charinfo,'$.phone') = phone_messages_conversations.participant_identifier
            WHERE updatedAt >= DATE_SUB(NOW(), INTERVAL 14 DAY)
            ORDER BY phone_messages_conversations.updatedAt DESC
        `,
            [phoneNumber]
        );
    }

    async getMessages(phoneNumber: string): Promise<Message[]> {
        return await exports.oxmysql.query_async(
            `SELECT DISTINCT phone_messages.id,
                              phone_messages.conversation_id,
                              phone_messages.message,
                              phone_messages.author
                       FROM phone_messages
                                INNER JOIN phone_messages_conversations ON phone_messages.conversation_id = phone_messages_conversations.conversation_id
                       WHERE phone_messages_conversations.participant_identifier = ? AND phone_messages.updatedAt >= DATE_SUB(NOW(), INTERVAL 14 DAY)
                       ORDER BY id DESC`,
            [phoneNumber]
        );
    }

    /**
     * Create a message group
     * @param userIdentifier - the user creating the message group
     * @param conversationId - the unique group ID this corresponds to
     * @param participantIdentifier - the participant user identifier. This identifier is what attaches
     * other players to the message group
     */
    async createMessageGroup(
        userIdentifier: string,
        conversationId: string,
        participantIdentifier: string
    ): Promise<void> {
        await exports.oxmysql.insert_async(
            'INSERT INTO phone_messages_conversations (user_identifier, conversation_id, participant_identifier) VALUES (?, ?, ?)',
            [userIdentifier, conversationId, participantIdentifier]
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
     * This method checks if the input groupId already exists in
     * the database. As long as the groupId is derived from the input
     * identifiers this means that the user is trying to create a
     * duplicate!
     * @param groupId - group Id to check that it exists
     */
    async checkIfMessageGroupExists(groupId: string): Promise<boolean> {
        const result = await exports.oxmysql.single_async(
            `SELECT COUNT(*) as count FROM phone_messages_conversations WHERE conversation_id = ?`,
            [groupId]
        );
        return result.count > 0;
    }

    async getMessageCountByGroup(groupId: string): Promise<number> {
        const result = await exports.oxmysql.single_async(
            `SELECT COUNT(*) as count FROM phone_messages WHERE conversation_id = ?`,
            [groupId]
        );
        return result.count;
    }

    /**
     * Sets the current message isRead to 0 for said player
     * @param conversation_id The unique group ID for the message
     * @param identifier The identifier for the player
     */
    async setMessageRead(conversation_id: string, identifier: string) {
        await exports.oxmysql.query_async(
            `UPDATE phone_messages_conversations SET unread = 0 WHERE conversation_id = ? AND user_identifier = ?`,
            [conversation_id, identifier]
        );
    }

    async setMessageArchived(conversation_id: string, identifier: string) {
        await exports.oxmysql.query_async(
            `UPDATE phone_messages_conversations SET masked = 1 WHERE conversation_id = ? AND user_identifier = ?`,
            [conversation_id, identifier]
        );
    }

    async deleteConversation(conversationId: string, sourcePhoneNumber: string) {
        await exports.oxmysql.query_async(
            `DELETE
                   FROM phone_messages_conversations
                   WHERE conversation_id = ?
                     AND participant_identifier = ?`,
            [conversationId, sourcePhoneNumber]
        );
    }

    async doesConversationExist(
        conversationId: string,
        identifier: string
    ): Promise<UnformattedMessageConversation | null> {
        return await exports.oxmysql.single_async(
            `SELECT *
                   FROM phone_messages_conversations
                   WHERE conversation_id = ?
                     AND participant_identifier = ?`,
            [conversationId, identifier]
        );
    }
}

const MessagesDB = new _MessagesDB();

export default MessagesDB;
