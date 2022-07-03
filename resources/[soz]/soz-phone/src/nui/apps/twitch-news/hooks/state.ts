import { ServerPromiseResp } from '@typings/common';
import { TwitchNewsEvents, TwitchNewsMessage } from '@typings/twitch-news';
import { fetchNui } from '@utils/fetchNui';
import { buildRespObj } from '@utils/misc';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { MockTwitchNewsMessages } from '../utils/constants';

export const messageState = {
    news: atom<TwitchNewsMessage[]>({
        key: 'twitchNewsMessages',
        default: selector({
            key: 'defaultTwitchNewsMessages',
            get: async () => {
                try {
                    const resp = await fetchNui<ServerPromiseResp<TwitchNewsMessage[]>>(
                        TwitchNewsEvents.FETCH_NEWS,
                        undefined,
                        buildRespObj(MockTwitchNewsMessages)
                    );
                    return resp.data.reverse();
                } catch (e) {
                    console.error(e);
                    return [];
                }
            },
        }),
    }),
};

export const useMessagesState = () => useRecoilState(messageState.news);
export const useMessagesValue = () => useRecoilValue(messageState.news);
export const useSetMessages = () => useSetRecoilState(messageState.news);
