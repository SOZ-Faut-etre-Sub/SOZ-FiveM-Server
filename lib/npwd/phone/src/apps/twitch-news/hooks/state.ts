import {atom, selector, useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {buildRespObj} from "@utils/misc";
import {MockTwitchNewsMessages} from "../utils/constants";
import {TwitchNewsEvents, TwitchNewsMessage} from "@typings/twitch-news";

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
                        buildRespObj(MockTwitchNewsMessages),
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
