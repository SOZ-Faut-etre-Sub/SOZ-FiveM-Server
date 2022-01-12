import { PreDBSociety } from '../../../typings/society';
import { ResultSetHeader } from 'mysql2';
import DbInterface from '../db/db_wrapper';

export class _SocietiesDB {
  async addSociety(
    identifier: string,
    { number, message, pedPosition }: PreDBSociety,
  ): Promise<number> {
    const query = `INSERT INTO phone_society_messages (conversation_id, source_phone, message, position)
                   VALUES (?, ?, ?, ?)`;

    const [setResult] = await DbInterface._rawExec(query, [
      number,
      identifier,
      message,
      pedPosition]);

    return (<ResultSetHeader>setResult).insertId;
  }
}

const SocietiesDb = new _SocietiesDB();
export default SocietiesDb;
