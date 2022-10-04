import { TwitchNewsMessage } from '../../../typings/twitch-news';

export class _TwitchNewsDB {
    async addNews({ type, image, message, reporter, reporterId }: TwitchNewsMessage): Promise<number> {
        return await exports.oxmysql.insert_async(
            'INSERT INTO phone_twitch_news (type, image, message, reporter, reporterId) VALUES (?, ?, ?, ?, ?)',
            [type, image, message, reporter, reporterId]
        );
    }

    async getNews(): Promise<TwitchNewsMessage[]> {
        return await exports.oxmysql.query_async(
            'SELECT *, unix_timestamp(createdAt)*1000 as createdAt FROM phone_twitch_news WHERE createdAt > date_sub(now(), interval 2 day)',
            []
        );
    }
}

const TwitchNewsDb = new _TwitchNewsDB();
export default TwitchNewsDb;
