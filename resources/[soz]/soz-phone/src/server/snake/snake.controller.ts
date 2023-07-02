import { SnakeEvents } from '../../../typings/snake';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import SnakeService from './snake.service';
import { snakeLogger } from './snake.utils';

onNetPromise<void, number>(SnakeEvents.GET_HIGHSCORE, (reqObj, resp) => {
    SnakeService.handleGetHighscore(reqObj, resp).catch(e => {
        snakeLogger.error(`Error occurred in get snake highscore event (${reqObj.source}), Error: ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<number, void>(SnakeEvents.SET_HIGHSCORE, (reqObj, resp) => {
    SnakeService.handleSetHighscore(reqObj, resp).catch(e => {
        snakeLogger.error(`Error occurred in set snake highscore event (${reqObj.source}), Error: ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});
