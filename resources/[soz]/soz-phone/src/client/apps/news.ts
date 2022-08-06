import { TwitchNewsEvents, TwitchNewsMessage } from '../../../typings/twitch-news';
import apps from '../../utils/apps';
import { sendMessage } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(TwitchNewsEvents.FETCH_NEWS);

onNet(TwitchNewsEvents.CREATE_NEWS_BROADCAST, (result: TwitchNewsMessage) => {
    sendMessage(apps.TWITCH_NEWS, TwitchNewsEvents.CREATE_NEWS_BROADCAST, result);
});
