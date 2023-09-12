import { SnakeEvents, SnakeLeaderboard } from '../../../typings/app/snake';
import apps from '../../utils/apps';
import { sendMessage } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(SnakeEvents.SEND_SCORE);
RegisterNuiProxy(SnakeEvents.FETCH_LEADERBOARD);

onNet(SnakeEvents.BROADCAST_LEADERBOARD, (result: SnakeLeaderboard) => {
    sendMessage(apps.SNAKE, SnakeEvents.BROADCAST_LEADERBOARD, result);
});
