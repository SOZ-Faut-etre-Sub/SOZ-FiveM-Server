import { TetrisEvents } from '../../../typings/app/tetris';
import { LeaderboardInterface } from '../../../typings/common';
import apps from '../../utils/apps';
import { sendMessage } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(TetrisEvents.SEND_SCORE);
RegisterNuiProxy(TetrisEvents.FETCH_LEADERBOARD);

onNet(TetrisEvents.BROADCAST_LEADERBOARD, (result: LeaderboardInterface) => {
    sendMessage(apps.TETRIS, TetrisEvents.BROADCAST_LEADERBOARD, result);
});
