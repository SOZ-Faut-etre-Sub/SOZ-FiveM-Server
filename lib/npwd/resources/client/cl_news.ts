import {RegisterNuiProxy} from './cl_utils';
import {sendMessage} from "../utils/messages";
import apps from "../utils/apps";
import {TwitchNewsEvents, TwitchNewsMessage} from "../../typings/twitch-news";

RegisterNuiProxy(TwitchNewsEvents.FETCH_NEWS);

onNet(TwitchNewsEvents.CREATE_NEWS_BROADCAST, (result: TwitchNewsMessage) => {
    sendMessage(apps.TWITCH_NEWS, TwitchNewsEvents.CREATE_NEWS_BROADCAST, result);
});
