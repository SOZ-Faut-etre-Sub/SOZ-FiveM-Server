export class _SnakeDB {
    /**
     * Find a player highscore from its citizenid
     * @param citizenid - the citizenid to search for
     */
    async getHighscore(citizenid: string): Promise<number> {
        const result = await exports.oxmysql.single_async('SELECT highscore FROM snake WHERE citizenid = ? LIMIT 1', [
            citizenid,
        ]);
        return result ? result.highscore : 0;
    }
}

const SnakeDB = new _SnakeDB();

export default SnakeDB;
