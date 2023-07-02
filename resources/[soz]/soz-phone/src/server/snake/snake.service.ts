import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import SnakeDB, { _SnakeDB } from './snake.db';
import { snakeLogger } from './snake.utils';

class _SnakeService {
    private readonly snakeDB: _SnakeDB;

    constructor() {
        this.snakeDB = SnakeDB;
    }

    async handleGetHighscoreMessage(reqObj: PromiseRequest<void>, resp: PromiseEventResp<number>) {
        snakeLogger.debug(`Get snake highscore event (${reqObj.source})`);

        resp({ status: 'ok', data: await this.snakeDB.getHighscore(PlayerService.getIdentifier(reqObj.source)) });
    }
}

const SnakeService = new _SnakeService();

export default SnakeService;
