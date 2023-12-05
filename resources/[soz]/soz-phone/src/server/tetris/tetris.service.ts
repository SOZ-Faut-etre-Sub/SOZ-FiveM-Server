import { TetrisEvents, TetrisLeaderboard, TetrisScore } from '../../../typings/app/tetris';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import TetrisDB, { _TetrisDB } from './tetris.db';
import { tetrisLogger } from './tetris.utils';

class _TetrisService {
    private readonly tetrisDB: _TetrisDB;
    private tetrisLeaderboard: TetrisLeaderboard[];

    constructor() {
        this.tetrisDB = TetrisDB;
        tetrisLogger.debug('Tetris service started');
    }

    async handleAddScore(reqObj: PromiseRequest<TetrisScore>, resp: PromiseEventResp<void>): Promise<void> {
        tetrisLogger.debug('Handling add score, score:');
        tetrisLogger.debug(reqObj.data);

        const identifier = PlayerService.getPlayer(reqObj.source).getIdentifier();

        try {
            await this.tetrisDB.addScore(identifier, reqObj.data);
            resp({ status: 'ok' });
        } catch (e) {
            tetrisLogger.error(`Error in handleAddScore, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }

        this.tetrisLeaderboard = await this.tetrisDB.getLeaderboard();
    }

    async getLeaderboard(reqObj: PromiseRequest<string>, resp: PromiseEventResp<TetrisLeaderboard[]>): Promise<void> {
        try {
            resp({ status: 'ok', data: this.tetrisLeaderboard });
        } catch (e) {
            tetrisLogger.error(`Error in getLeaderboard, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async fetchLeaderboard(): Promise<void> {
        try {
            this.tetrisLeaderboard = await this.tetrisDB.getLeaderboard();
            emitNet(TetrisEvents.BROADCAST_LEADERBOARD, -1, this.tetrisLeaderboard);
        } catch (e) {
            tetrisLogger.error(`Error in fetchLeaderboard, ${e.toString()}`);
        }
    }
}

const TetrisService = new _TetrisService();

// Init leaderboard
TetrisService.fetchLeaderboard().catch(e => {
    tetrisLogger.error(`Error occured in fetchLeaderboard event, Error:  ${e.message}`);
});

export default TetrisService;
