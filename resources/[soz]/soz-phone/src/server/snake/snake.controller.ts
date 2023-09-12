import { SnakeEvents, SnakeScore } from '../../../typings/app/snake';
import { LeaderboardInterface } from '../../../typings/common';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import SnakeService from './snake.service';
import { snakeLogger } from './snake.utils';

onNetPromise<SnakeScore, void>(SnakeEvents.SEND_SCORE, (reqObj, resp) => {
    SnakeService.handleAddScore(reqObj, resp).catch(e => {
        snakeLogger.error(`Error occured in add score event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<string, LeaderboardInterface[]>(SnakeEvents.FETCH_LEADERBOARD, (reqObj, resp) => {
    SnakeService.getLeaderboard(reqObj, resp).catch(e => {
        snakeLogger.error(
            `Error occured in fetch fetch snake leaderboard event (${reqObj.source}), Error:  ${e.message}`
        );
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});
