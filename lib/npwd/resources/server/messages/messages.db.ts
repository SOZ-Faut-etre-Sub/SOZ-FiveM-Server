import {
  Message,
  MessageConversation,
  UnformattedMessageConversation,
} from '../../../typings/messages';
import { config } from '../server';
import { ResultSetHeader } from 'mysql2';
import DbInterface from '../db/db_wrapper';

const MESSAGES_PER_PAGE = 20;

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
    message: string,
  ): Promise<number> {
    const query = `INSERT INTO npwd_messages (user_identifier, author, message, conversation_id)
                   VALUES (?, ?, ?, ?)`;

    const [results] = await DbInterface._rawExec(query, [
      userIdentifier,
      author,
      message,
      conversationId,
    ]);

    return (<ResultSetHeader>results).insertId;
  }

  // Not sure if we're going to query this exactly as its done here.
  /**
   * Retrieve all message conversations associated with a user. This will
   * populate the list of message conversations on the UI
   * @param phoneNumber - phoneNumber of the user to get message conversations for
   */
  async getMessageConversations(phoneNumber: string): Promise<UnformattedMessageConversation[]> {
    const query = `SELECT npwd_messages_conversations.unread,
                          npwd_messages_conversations.conversation_id,
                          npwd_messages_conversations.user_identifier,
                          npwd_messages_conversations.participant_identifier,
                          ${config.database.playerTable}.${config.database.phoneNumberColumn} AS phone_number
                   FROM (SELECT conversation_id
                         FROM npwd_messages_conversations
                         WHERE npwd_messages_conversations.participant_identifier = ?) AS t
                            LEFT OUTER JOIN npwd_messages_conversations
                                            ON npwd_messages_conversations.conversation_id = t.conversation_id
                            LEFT OUTER JOIN ${config.database.playerTable}
                                            ON ${config.database.playerTable}.${config.database.phoneNumberColumn} = npwd_messages_conversations.participant_identifier
		`;

    const [results] = await DbInterface._rawExec(query, [phoneNumber]);
    return <UnformattedMessageConversation[]>results;
  }

  async getMessages(conversationId: string, page: number): Promise<Message[]> {
    const offset = page * MESSAGES_PER_PAGE;

    const query = `SELECT npwd_messages.id,
                          npwd_messages.conversation_id,
                          npwd_messages.message,
                          npwd_messages.author
                   FROM npwd_messages
                   WHERE npwd_messages.conversation_id = ?
                   ORDER BY id DESC
                   LIMIT ? OFFSET ?`;

    const [results] = await DbInterface._rawExec(query, [
      conversationId,
      MESSAGES_PER_PAGE,
      offset,
    ]);

    return <Message[]>results;
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
    participantIdentifier: string,
  ): Promise<void> {
    const query = `
        INSERT
        INTO npwd_messages_conversations
            (user_identifier, conversation_id, participant_identifier)
        VALUES (?, ?, ?)
		`;
    await DbInterface._rawExec(query, [userIdentifier, conversationId, participantIdentifier]);
  }

  /**
   * Find a players identifier from their phone number
   * @param phoneNumber - the phone number to search for
   */
  async getIdentifierFromPhoneNumber(phoneNumber: string): Promise<string> {
    const query = `
        SELECT ${config.database.identifierColumn}
        FROM ${config.database.playerTable}
        WHERE ${config.database.phoneNumberColumn} = ?
        LIMIT 1
		`;
    const [results] = await DbInterface._rawExec(query, [phoneNumber]);
    const result = <any>results;
    return result[0].identifier;
  }

  /**
   * This method checks if the input groupId already exists in
   * the database. As long as the groupId is derived from the input
   * identifiers this means that the user is trying to create a
   * duplicate!
   * @param groupId - group Id to check that it exists
   */
  async checkIfMessageGroupExists(groupId: string): Promise<boolean> {
    const query = `
        SELECT COUNT(*) as count
        FROM npwd_messages_conversations
        WHERE conversation_id = ?;
		`;
    const [results] = await DbInterface._rawExec(query, [groupId]);
    const result = <any>results;
    const count = result[0].count;
    return count > 0;
  }

  async getMessageCountByGroup(groupId: string): Promise<number> {
    const query = `
        SELECT COUNT(*) as count
        FROM npwd_messages
        WHERE conversation_id = ?`;
    const [results] = await DbInterface._rawExec(query, [groupId]);
    const result = <any>results;
    return result[0].count;
  }

  /**
   * Sets the current message isRead to 0 for said player
   * @param groupId The unique group ID for the message
   * @param identifier The identifier for the player
   */
  async setMessageRead(groupId: string, identifier: string) {
    const query = `UPDATE npwd_messages_conversations
                   SET unreadCount = 0
                   WHERE conversation_id = ?
                     AND participant_identifier = ?`;
    await DbInterface._rawExec(query, [groupId, identifier]);
  }

  async deleteConversation(conversationId: string, sourcePhoneNumber: string) {
    const query = `DELETE
                   FROM npwd_messages_conversations
                   WHERE conversation_id = ?
                     AND participant_identifier = ?`;
    await DbInterface._rawExec(query, [conversationId, sourcePhoneNumber]);
  }

  async deleteMessage(message: Message) {
    const query = `DELETE
                   FROM npwd_messages
                   WHERE id = ?
                     AND conversation_id = ?`;

    await DbInterface._rawExec(query, [message.id, message.conversation_id]);
  }

  async doesConversationExist(
    conversationId: string,
    identifier: string,
  ): Promise<UnformattedMessageConversation | null> {
    const query = `SELECT *
                   FROM npwd_messages_conversations
                   WHERE conversation_id = ?
                     AND participant_identifier = ?`;
    const [results] = await DbInterface._rawExec(query, [conversationId, identifier]);
    const conversations = <UnformattedMessageConversation[]>results;
    return conversations[0] || null;
  }
}

const MessagesDB = new _MessagesDB();

export default MessagesDB;
