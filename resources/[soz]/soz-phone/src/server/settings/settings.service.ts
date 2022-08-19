import { PreDBSettings } from '../../../typings/settings';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import SettingsDb, { _SettingsDB } from './settings.db';
import { settingsLogger } from './settings.utils';

class _SettingsService {
    private readonly settingsDB: _SettingsDB;

    constructor() {
        this.settingsDB = SettingsDb;
        settingsLogger.debug('Settings service started');
    }

    async handleUpdateProfilePicture(
        reqObj: PromiseRequest<PreDBSettings>,
        resp: PromiseEventResp<number>
    ): Promise<void> {
        const identifier = PlayerService.getPlayer(reqObj.source).getPhoneNumber();

        try {
            const contact = await this.settingsDB.addPicture(identifier, reqObj.data);

            resp({ status: 'ok', data: contact });
        } catch (e) {
            settingsLogger.error(`Error in handleAddSociety, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async getProfilePicture(reqObj: PromiseRequest<void>, resp: PromiseEventResp<string>): Promise<void> {
        const identifier = PlayerService.getPlayer(reqObj.source).getPhoneNumber();

        try {
            const avatar = await this.settingsDB.getProfilePicture(identifier);

            resp({ status: 'ok', data: avatar });
        } catch (e) {
            settingsLogger.error(`Error in getProfilePicture, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }
}

const SettingsService = new _SettingsService();
export default SettingsService;
