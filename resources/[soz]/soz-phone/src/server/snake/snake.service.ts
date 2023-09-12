import { SnakeEvents, SnakeLeaderboard, SnakeScore } from '../../../typings/app/snake';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import SnakeDB, { _SnakeDB } from './snake.db';
import { snakeLogger } from './snake.utils';

class _SnakeService {
    private readonly snakeDB: _SnakeDB;
    private snakeLeaderboard: SnakeLeaderboard[];

    constructor() {
        this.snakeDB = SnakeDB;
        snakeLogger.debug('Snake service started');
    }

    async handleAddScore(reqObj: PromiseRequest<SnakeScore>, resp: PromiseEventResp<void>): Promise<void> {
        snakeLogger.debug('Handling add score, score:');
        snakeLogger.debug(reqObj.data);

        const identifier = PlayerService.getPlayer(reqObj.source).getIdentifier();

        try {
            await this.snakeDB.addScore(identifier, reqObj.data);
            resp({ status: 'ok' });
        } catch (e) {
            snakeLogger.error(`Error in handleAddScore, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }

        this.snakeLeaderboard = await this.snakeDB.getLeaderboard();
    }

    async getLeaderboard(reqObj: PromiseRequest<string>, resp: PromiseEventResp<SnakeLeaderboard[]>): Promise<void> {
        try {
            resp({ status: 'ok', data: this.snakeLeaderboard });
        } catch (e) {
            snakeLogger.error(`Error in getLeaderboard, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async fetchLeaderboard(): Promise<void> {
        try {
            this.snakeLeaderboard = await this.snakeDB.getLeaderboard();
            emitNet(SnakeEvents.BROADCAST_LEADERBOARD, -1, this.snakeLeaderboard);
        } catch (e) {
            snakeLogger.error(`Error in fetchLeaderboard, ${e.toString()}`);
        }
    }
}

const SnakeService = new _SnakeService();

// Init leaderboard
SnakeService.fetchLeaderboard().catch(e => {
    snakeLogger.error(`Error occured in fetchLeaderboard event, Error:  ${e.message}`);
});

export default SnakeService;
