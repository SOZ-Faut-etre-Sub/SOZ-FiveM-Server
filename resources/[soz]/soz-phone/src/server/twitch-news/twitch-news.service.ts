import { TwitchNewsEvents, TwitchNewsMessage } from '../../../typings/twitch-news';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import SocietiesDb, { _TwitchNewsDB } from './twitch-news.db';
import { twitchNewsLogger } from './twitch-news.utils';

class _TwitchNewsService {
    private readonly twitchNewsDB: _TwitchNewsDB;

    constructor() {
        this.twitchNewsDB = SocietiesDb;
        twitchNewsLogger.debug('Societies service started');
    }

    async handleSendNews(reqObj: PromiseRequest<TwitchNewsMessage>, resp: PromiseEventResp<number>): Promise<void> {
        try {
            const news = await this.twitchNewsDB.addNews(reqObj.data);
            resp({ status: 'ok', data: news });

            emit(TwitchNewsEvents.API_NEWS_BROADCAST, {
                type: reqObj.data.type,
                message: reqObj.data.message,
                reporter: reqObj.data.reporter,
                reporterId: reqObj.data.reporterId,
                image: reqObj.data.image,
                job: reqObj.data.job,
            });

            emitNet(TwitchNewsEvents.CREATE_NEWS_BROADCAST, -1, {
                id: news,
                type: reqObj.data.type,
                reporter: reqObj.data.reporter,
                reporterId: reqObj.data.reporterId,
                image: reqObj.data.image,
                message: reqObj.data.message,
                job: reqObj.data.job,
                createdAt: new Date().getTime(),
            });

            emitNet(
                'soz-core:client:news:draw',
                -1,
                reqObj.data.type,
                reqObj.data.message,
                reqObj.data.reporter,
                reqObj.data.job
            );
        } catch (e) {
            twitchNewsLogger.error(`Error in handleAddSociety, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async fetchNews(reqObj: PromiseRequest<string>, resp: PromiseEventResp<TwitchNewsMessage[]>): Promise<void> {
        try {
            const contact = await this.twitchNewsDB.getNews();
            resp({ status: 'ok', data: contact });
        } catch (e) {
            twitchNewsLogger.error(`Error in handleAddSociety, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }
}

const TwitchNewsService = new _TwitchNewsService();
export default TwitchNewsService;
