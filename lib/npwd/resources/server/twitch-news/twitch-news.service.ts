import {twitchNewsLogger} from './twitch-news.utils';
import SocietiesDb, {_TwitchNewsDB} from './twitch-news.db';
import {PromiseEventResp, PromiseRequest} from '../lib/PromiseNetEvents/promise.types';
import {TwitchNewsEvents, TwitchNewsMessage} from "../../../typings/twitch-news";

class _TwitchNewsService {
    private readonly twitchNewsDB: _TwitchNewsDB;

    constructor() {
        this.twitchNewsDB = SocietiesDb;
        twitchNewsLogger.debug('Societies service started');
    }

    async handleSendNews(
        reqObj: PromiseRequest<TwitchNewsMessage>,
        resp: PromiseEventResp<number>,
    ): Promise<void> {
        try {
            const news = await this.twitchNewsDB.addNews(reqObj.data);
            resp({status: 'ok', data: news});

            emit(TwitchNewsEvents.API_NEWS_BROADCAST, {
                type: reqObj.data.type,
                message: reqObj.data.message,
                reporter: reqObj.data.reporter,
                image: reqObj.data.image,
            });

            emitNet(TwitchNewsEvents.CREATE_NEWS_BROADCAST, -1, {
                id: news,
                type: reqObj.data.type,
                reporter: reqObj.data.reporter,
                image: reqObj.data.image,
                message: reqObj.data.message,
                createdAt: new Date().getTime()
            });

            emitNet('hud:client:DrawNewsBanner', -1, reqObj.data.type, reqObj.data.message, reqObj.data.reporter);
        } catch (e) {
            twitchNewsLogger.error(`Error in handleAddSociety, ${e.message}`);
            resp({status: 'error', errorMsg: 'DB_ERROR'});
        }
    }

    async fetchNews(reqObj: PromiseRequest<string>, resp: PromiseEventResp<TwitchNewsMessage[]>): Promise<void> {
        try {
            const contact = await this.twitchNewsDB.getNews();
            resp({status: 'ok', data: contact});
        } catch (e) {
            twitchNewsLogger.error(`Error in handleAddSociety, ${e.message}`);
            resp({status: 'error', errorMsg: 'DB_ERROR'});
        }
    }
}

const TwitchNewsService = new _TwitchNewsService();
export default TwitchNewsService;
