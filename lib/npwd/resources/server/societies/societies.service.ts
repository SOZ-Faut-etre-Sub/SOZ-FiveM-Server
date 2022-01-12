import PlayerService from '../players/player.service';
import { societiesLogger } from './societies.utils';
import SocietiesDb, { _SocietiesDB } from './societies.db';
import { PreDBSociety } from '../../../typings/society';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';

class _SocietyService {
  private readonly contactsDB: _SocietiesDB;

  constructor() {
    this.contactsDB = SocietiesDb;
    societiesLogger.debug('Societies service started');
  }

  async handleSendSocietyMessage(
    reqObj: PromiseRequest<PreDBSociety>,
    resp: PromiseEventResp<number>,
  ): Promise<void> {
    const identifier = PlayerService.getPlayer(reqObj.source).getPhoneNumber();

    if (reqObj.data.position) {
      const ped = GetPlayerPed(reqObj.source.toString());
      const [playerX, playerY, playerZ] = GetEntityCoords(ped);

      reqObj.data.pedPosition = JSON.stringify({x: playerX, y: playerY, z: playerZ})
    }

    try {
      const contact = await this.contactsDB.addSociety(identifier, reqObj.data);

      resp({ status: 'ok', data: contact });
    } catch (e) {
      societiesLogger.error(`Error in handleAddSociety, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }
}

const SocietyService = new _SocietyService();
export default SocietyService;
