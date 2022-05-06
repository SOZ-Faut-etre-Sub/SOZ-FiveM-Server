import { ResultSetHeader } from 'mysql2';
import DbInterface from '../db/db_wrapper';
import {TwitchNewsMessage} from "../../../typings/twitch-news";

export class _TwitchNewsDB {
  async addNews({ type, image, message, reporter }: TwitchNewsMessage): Promise<number> {
    const query = `INSERT INTO phone_twitch_news (type, image, message, reporter) VALUES (?, ?, ?, ?)`;
    const [setResult] = await DbInterface._rawExec(query, [type, image, message, reporter]);
    return (<ResultSetHeader>setResult).insertId;
  }

  async getNews(): Promise<TwitchNewsMessage[]> {
    const query = `SELECT *, unix_timestamp(createdAt)*1000 as createdAt FROM phone_twitch_news WHERE createdAt > date_sub(now(), interval 2 day)`;
    const [result] = await DbInterface._rawExec(query, []);
    return <TwitchNewsMessage[]>result;
  }
}

const TwitchNewsDb = new _TwitchNewsDB();
export default TwitchNewsDb;
