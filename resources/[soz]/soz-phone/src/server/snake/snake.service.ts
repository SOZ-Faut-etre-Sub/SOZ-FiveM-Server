import { SnakeEvents } from '../../../typings/snake';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import SnakeDB, { _SnakeDB } from './snake.db';
import { snakeLogger } from './snake.utils';

class _SnakeService {
    private readonly snakeDB: _SnakeDB;

    constructor() {
        this.snakeDB = SnakeDB;
    }

    async handleGetHighscore(reqObj: PromiseRequest<void>, resp: PromiseEventResp<number>) {
        snakeLogger.debug(`Get snake highscore event (${reqObj.source})`);

        resp({ status: 'ok', data: await this.snakeDB.getHighscore(PlayerService.getIdentifier(reqObj.source)) });
    }

    async handleSetHighscore(reqObj: PromiseRequest<number>, resp: PromiseEventResp<void>): Promise<void> {
        snakeLogger.debug(`Set snake highscore event (${reqObj.source})`);
        const result = await this.snakeDB.updateHighscore(PlayerService.getIdentifier(reqObj.source), reqObj.data);
        if (result === 0) {
            await this.snakeDB.insertHighscore(PlayerService.getIdentifier(reqObj.source), reqObj.data);
        }
        resp({ status: 'ok' });
        emitNet(SnakeEvents.UPDATE_HIGHSCORE, reqObj.source, undefined);
    }
}

const SnakeService = new _SnakeService();

export default SnakeService;
