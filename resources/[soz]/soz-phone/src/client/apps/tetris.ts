import { TetrisEvents, TetrisLeaderboard } from '../../../typings/app/tetris';
import apps from '../../utils/apps';
import { sendMessage } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(TetrisEvents.SEND_SCORE);
RegisterNuiProxy(TetrisEvents.FETCH_LEADERBOARD);

onNet(TetrisEvents.BROADCAST_LEADERBOARD, (result: TetrisLeaderboard) => {
    sendMessage(apps.TETRIS, TetrisEvents.BROADCAST_LEADERBOARD, result);
});
