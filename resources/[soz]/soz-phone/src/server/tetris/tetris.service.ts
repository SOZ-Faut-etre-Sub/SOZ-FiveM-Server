import { TetrisEvents, TetrisLeaderboard, TetrisScore } from '../../../typings/app/tetris';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import SettingsDb from '../settings/settings.db';
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

        const player = PlayerService.getPlayer(reqObj.source);
        const identifier = player.getIdentifier();

        try {
            await this.tetrisDB.addScore(identifier, reqObj.data);
            resp({ status: 'ok' });
        } catch (e) {
            tetrisLogger.error(`Error in handleAddScore, ${e}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }

        let leaderboardForPlayer = this.tetrisLeaderboard.find(elem => elem.citizenid == identifier);
        if (!leaderboardForPlayer) {
            leaderboardForPlayer = {
                citizenid: identifier,
                avatar: await SettingsDb.getProfilePicture(player.getPhoneNumber()),
                game_played: 0,
                player_name: player.getUsername(),
                score: 0,
            };
            this.tetrisLeaderboard.push(leaderboardForPlayer);
        }

        leaderboardForPlayer.game_played++;
        if (leaderboardForPlayer.score < reqObj.data.score) {
            leaderboardForPlayer.score = reqObj.data.score;
        }

        this.tetrisLeaderboard = this.tetrisLeaderboard.sort((a, b) => b.score - a.score);
    }

    async getLeaderboard(reqObj: PromiseRequest<string>, resp: PromiseEventResp<TetrisLeaderboard[]>): Promise<void> {
        try {
            resp({ status: 'ok', data: this.tetrisLeaderboard });
        } catch (e) {
            tetrisLogger.error(`Error in getLeaderboard, ${e}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async fetchLeaderboard(): Promise<void> {
        try {
            this.tetrisLeaderboard = await this.tetrisDB.getDBLeaderboard();
            emitNet(TetrisEvents.BROADCAST_LEADERBOARD, -1, this.tetrisLeaderboard);
        } catch (e) {
            tetrisLogger.error(`Error in fetchLeaderboard, ${e}`);
        }
    }
}

const TetrisService = new _TetrisService();

// Init leaderboard
TetrisService.fetchLeaderboard().catch(e => {
    tetrisLogger.error(`Error occured in fetchLeaderboard event, Error:  ${e}`);
});

export default TetrisService;
