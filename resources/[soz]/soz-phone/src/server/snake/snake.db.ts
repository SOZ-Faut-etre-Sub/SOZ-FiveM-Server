import { SnakeLeaderboard, SnakeScore } from '../../../typings/app/snake';

export class _SnakeDB {
    async addScore(identifier: string, score: SnakeScore): Promise<number> {
        return await exports.oxmysql.insert_async('INSERT INTO snake_score (identifier, score) VALUES (?, ?)', [
            identifier,
            score.score,
        ]);
    }

    getLeaderboard(): Promise<SnakeLeaderboard[]> {
        return exports.oxmysql.query_async(
            `
            SELECT player.citizenid, phone_profile.avatar, concat(JSON_VALUE(player.charinfo, '$.firstname'), ' ', JSON_VALUE(player.charinfo, '$.lastname')) as player_name, MAX(snake_score.score) AS score, try_count.game_played
            FROM snake_score
                LEFT JOIN player ON player.citizenid = snake_score.identifier
                LEFT JOIN phone_profile ON JSON_VALUE(player.charinfo, '$.phone') = phone_profile.number
                LEFT JOIN (SELECT COUNT(*) as game_played, snake_score.identifier FROM snake_score GROUP BY snake_score.identifier) AS try_count ON player.citizenid = try_count.identifier GROUP BY player.citizenid, try_count.game_played ORDER BY score DESC
        `,
            []
        );
    }
}

const SnakeDB = new _SnakeDB();

export default SnakeDB;
