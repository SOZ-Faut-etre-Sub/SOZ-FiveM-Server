import { DBSocietyUpdate, PreDBSociety, SocietyMessage } from '../../../typings/society';

export class _SocietiesDB {
    async addSociety(identifier: string, { number, message, pedPosition }: PreDBSociety): Promise<number> {
        return exports.oxmysql.insert_async(
            `INSERT INTO phone_society_messages (conversation_id, source_phone, message, position) VALUES (?, ?, ?, ?)`,
            [number, identifier, message, pedPosition]
        );
    }

    async updateMessage({ id, take, takenBy, takenByUsername, done }: DBSocietyUpdate): Promise<boolean> {
        return (
            exports.oxmysql.update_async(
                `UPDATE phone_society_messages SET isTaken=?, takenBy=?, takenByUsername=?, isDone=? WHERE id=?`,
                [take, takenBy, takenByUsername, done, id]
            ) === 1
        );
    }

    async getMessage(id: number): Promise<SocietyMessage[]> {
        return exports.oxmysql.query_async(
            `SELECT *, unix_timestamp(createdAt)*1000 as createdAt, unix_timestamp(updatedAt)*1000 as updatedAt FROM phone_society_messages WHERE id = ?`,
            [id]
        );
    }

    async getMessages(identifier: string): Promise<SocietyMessage[]> {
        return exports.oxmysql.query_async(
            `SELECT *, unix_timestamp(createdAt)*1000 as createdAt, unix_timestamp(updatedAt)*1000 as updatedAt FROM phone_society_messages WHERE conversation_id = ? AND updatedAt > date_sub(now(), interval 2 day)`,
            [identifier]
        );
    }
}

const SocietiesDb = new _SocietiesDB();
export default SocietiesDb;
