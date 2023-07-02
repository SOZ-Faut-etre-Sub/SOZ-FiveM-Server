import { SnakeEvents } from '../../../typings/snake';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import SnakeService from './snake.service';
import { snakeLogger } from './snake.utils';

// void as we don't accept anything, string as we return a string.
onNetPromise<void, number>(SnakeEvents.GET_HIGHSCORE, (reqObj, resp) => {
    SnakeService.handleGetHighscoreMessage(reqObj, resp).catch(e => {
        snakeLogger.error(`Error occurred in get snake highscore event (${reqObj.source}), Error: ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});
