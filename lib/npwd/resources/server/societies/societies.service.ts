import PlayerService from '../players/player.service';
import { societiesLogger } from './societies.utils';
import SocietiesDb, { _SocietiesDB } from './societies.db';
import {DBSocietyUpdate, PreDBSociety, SocietyEvents, SocietyMessage} from '../../../typings/society';
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
    let identifier = PlayerService.getPlayer(reqObj.source).getPhoneNumber();

    if (reqObj.data.position) {
      const ped = GetPlayerPed(reqObj.source.toString());
      const [playerX, playerY, playerZ] = GetEntityCoords(ped);

      reqObj.data.pedPosition = JSON.stringify({x: playerX, y: playerY, z: playerZ})
    }

    if (reqObj.data.anonymous) {
      identifier = ''
    }

    try {
      const contact = await this.contactsDB.addSociety(identifier, reqObj.data);

      resp({ status: 'ok', data: contact });

      const players = await PlayerService.getPlayersFromSocietyNumber(reqObj.data.number);
      players.forEach((player) => {
        emitNet(SocietyEvents.CREATE_MESSAGE_BROADCAST, player.source, {
          id: contact,
          conversation_id: reqObj.data.number,
          source_phone: identifier,
          message: reqObj.data.message,
          position: reqObj.data.pedPosition,
          isTaken: false,
          isDone: false,
          createdAt: new Date().getTime()/1000,
          updatedAt: new Date().getTime()/1000
        });
      })
    } catch (e) {
      societiesLogger.error(`Error in handleAddSociety, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async updateSocietyMessage(
    reqObj: PromiseRequest<DBSocietyUpdate>,
    resp: PromiseEventResp<boolean>,
  ): Promise<void> {
    let identifier = PlayerService.getPlayer(reqObj.source).getSocietyPhoneNumber();

    try {
      const contact = await this.contactsDB.updateMessage(reqObj.data);
      resp({ status: 'ok', data: contact });

      const players = await PlayerService.getPlayersFromSocietyNumber(identifier);
      players.forEach((player) => {
        emitNet(SocietyEvents.RESET_SOCIETY_MESSAGES, player.source, null)
      });
    } catch (e) {
      societiesLogger.error(`Error in handleAddSociety, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async fetchSocietyMessages(
    reqObj: PromiseRequest<string>,
    resp: PromiseEventResp<SocietyMessage[]>,
  ): Promise<void> {
    let identifier = PlayerService.getPlayer(reqObj.source).getSocietyPhoneNumber();

    try {
      const contact = await this.contactsDB.getMessages(identifier);

      resp({ status: 'ok', data: contact });
    } catch (e) {
      societiesLogger.error(`Error in handleAddSociety, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }
}

const SocietyService = new _SocietyService();
export default SocietyService;
