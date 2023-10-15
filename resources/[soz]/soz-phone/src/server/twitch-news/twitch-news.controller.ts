import { TwitchNewsEvents, TwitchNewsMessage } from '../../../typings/twitch-news';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import TwitchNewsService from './twitch-news.service';
import { twitchNewsLogger } from './twitch-news.utils';

onNetPromise<string, TwitchNewsMessage[]>(TwitchNewsEvents.FETCH_NEWS, (reqObj, resp) => {
    TwitchNewsService.fetchNews(reqObj, resp).catch(e => {
        twitchNewsLogger.error(`Error occured in fetch news event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<TwitchNewsMessage, number>(TwitchNewsEvents.CREATE_NEWS_BROADCAST, (reqObj, resp) => {
    TwitchNewsService.handleSendNews(reqObj, resp).catch(e => {
        twitchNewsLogger.error(`Error occured in create news broadcast event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});
