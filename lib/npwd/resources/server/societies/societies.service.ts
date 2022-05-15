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
    let player = PlayerService.getPlayer(reqObj.source);
    let identifier = player.getPhoneNumber();

    if (reqObj.data.position) {
      const ped = GetPlayerPed(reqObj.source.toString());
      const [playerX, playerY, playerZ] = GetEntityCoords(ped);

      reqObj.data.pedPosition = JSON.stringify({x: playerX, y: playerY, z: playerZ})
    }

    if (reqObj.data.anonymous) {
      identifier = ''
    }

    if (reqObj.data.number === "555-FBI") {
        await global.exports['soz-utils'].SendHTTPRequest("discord_webhook_fbi", {
            title: 'Federal Bureau of Investigation',
            content: `**Nouveau message reçu : ** \`${player.getPhoneNumber()} - ${player.username}\` \`\`\`${reqObj.data.message}\`\`\` `
        });

        resp({ status: 'ok', data: null });
        return;
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
      const message = await this.contactsDB.updateMessage(reqObj.data);
      resp({ status: 'ok', data: message });

      const societyMessage = await this.contactsDB.getMessage(reqObj.data.id);
      if (societyMessage[0]) {
          const player = await PlayerService.getPlayersFromNumber(societyMessage[0].source_phone);
          if (player) {
            emitNet("hud:client:DrawNotification", player.source, "Votre ~b~appel~s~ vient d'être pris !", "info")
          }
      }

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
