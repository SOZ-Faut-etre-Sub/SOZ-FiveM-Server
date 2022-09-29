import { PreDBSettings } from '../../../typings/settings';

export class _SettingsDB {
    async addPicture(identifier: string, { number, url }: PreDBSettings): Promise<number> {
        return exports.oxmysql.insert_async(
            `INSERT INTO phone_profile (number, avatar) VALUES (?, ?) ON DUPLICATE KEY UPDATE avatar=?`,
            [number, url, url]
        );
    }

    async getProfilePicture(number: string): Promise<string | null> {
        const result = exports.oxmysql.single_async(`SELECT avatar FROM phone_profile WHERE number = ?`, [number]);
        return result['avatar'] ?? null;
    }
}

const SettingsDb = new _SettingsDB();
export default SettingsDb;
