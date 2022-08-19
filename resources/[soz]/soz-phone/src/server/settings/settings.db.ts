import { ResultSetHeader } from 'mysql2';

import { PreDBSettings } from '../../../typings/settings';
import DbInterface from '../db/db_wrapper';

export class _SettingsDB {
    async addPicture(identifier: string, { number, url }: PreDBSettings): Promise<number> {
        const query = `INSERT INTO phone_profile (number, avatar) VALUES (?, ?) ON DUPLICATE KEY UPDATE avatar=?`;
        const [setResult] = await DbInterface._rawExec(query, [number, url, url]);

        return (<ResultSetHeader>setResult).insertId;
    }

    async getProfilePicture(number: string): Promise<string | null> {
        const query = `SELECT avatar FROM phone_profile WHERE number = ?`;
        const [results] = await DbInterface._rawExec(query, [number]);
        return (results as any[])[0] ? (results as any[])[0]['avatar'] : null;
    }
}

const SettingsDb = new _SettingsDB();
export default SettingsDb;
