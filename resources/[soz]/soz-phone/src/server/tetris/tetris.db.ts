import { TetrisLeaderboard, TetrisScore } from '../../../typings/app/tetris';

export class _TetrisDB {
    async addScore(identifier: string, score: TetrisScore): Promise<number> {
        return await exports.oxmysql.insert_async('INSERT INTO tetris_score (identifier, score) VALUES (?, ?)', [
            identifier,
            score.score,
        ]);
    }

    getDBLeaderboard(): Promise<TetrisLeaderboard[]> {
        return exports.oxmysql.query_async(
            `
            SELECT player.citizenid, phone_profile.avatar, concat(JSON_VALUE(player.charinfo, '$.firstname'), ' ', JSON_VALUE(player.charinfo, '$.lastname')) as player_name, MAX(tetris_score.score) AS score, try_count.game_played
            FROM tetris_score
                LEFT JOIN player ON player.citizenid = tetris_score.identifier
                LEFT JOIN phone_profile ON JSON_VALUE(player.charinfo, '$.phone') = phone_profile.number
                LEFT JOIN (SELECT COUNT(*) as game_played, tetris_score.identifier FROM tetris_score GROUP BY tetris_score.identifier) AS try_count ON player.citizenid = try_count.identifier GROUP BY player.citizenid, try_count.game_played ORDER BY score DESC
        `,
            []
        );
    }
}

const TetrisDB = new _TetrisDB();

export default TetrisDB;
