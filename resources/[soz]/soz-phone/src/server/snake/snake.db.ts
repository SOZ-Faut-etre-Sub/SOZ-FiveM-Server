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

    /**
     * Update a player highscore from its citizenid
     * @param citizenid - the citizenid to search for
     * @param highscore - the highscore to set
     */
    async updateHighscore(citizenid: string, highscore: number): Promise<any> {
        return await exports.oxmysql.update_async('UPDATE snake SET highscore = ? WHERE citizenid = ?', [
            highscore,
            citizenid,
        ]);
    }

    /**
     * Register a player highscore
     * @param citizenid - the citizenid to set
     * @param highscore - the highscore to set
     */
    async insertHighscore(citizenid: string, highscore: number): Promise<any> {
        await exports.oxmysql.update_async('INSERT INTO snake (citizenId, highscore) VALUES (?,?)', [
            citizenid,
            highscore,
        ]);
    }
}

const SnakeDB = new _SnakeDB();

export default SnakeDB;
