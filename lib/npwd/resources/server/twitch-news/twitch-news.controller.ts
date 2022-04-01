import { twitchNewsLogger } from './twitch-news.utils';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import {TwitchNewsEvents, TwitchNewsMessage} from "../../../typings/twitch-news";
import TwitchNewsService from "./twitch-news.service";

onNetPromise<string, TwitchNewsMessage[]>(TwitchNewsEvents.FETCH_NEWS, (reqObj, resp) => {
    TwitchNewsService.fetchNews(reqObj, resp).catch((e) => {
      twitchNewsLogger.error(
      `Error occured in fetch news event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<TwitchNewsMessage, number>(TwitchNewsEvents.CREATE_NEWS_BROADCAST, (reqObj, resp) => {
    TwitchNewsService.handleSendNews(reqObj, resp).catch((e) => {
        twitchNewsLogger.error(
            `Error occured in fetch contacts event (${reqObj.source}), Error:  ${e.message}`,
        );
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});
