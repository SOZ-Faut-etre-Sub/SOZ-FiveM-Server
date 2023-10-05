import { TetrisEvents, TetrisScore } from '../../../typings/app/tetris';
import { LeaderboardInterface } from '../../../typings/common';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import TetrisService from './tetris.service';
import { tetrisLogger } from './tetris.utils';

onNetPromise<TetrisScore, void>(TetrisEvents.SEND_SCORE, (reqObj, resp) => {
    TetrisService.handleAddScore(reqObj, resp).catch(e => {
        tetrisLogger.error(`Error occured in add score event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<string, LeaderboardInterface[]>(TetrisEvents.FETCH_LEADERBOARD, (reqObj, resp) => {
    TetrisService.getLeaderboard(reqObj, resp).catch(e => {
        tetrisLogger.error(
            `Error occured in fetch fetch tetris leaderboard event (${reqObj.source}), Error:  ${e.message}`
        );
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});
