import {
    DBSocietyUpdate,
    PreDBSociety,
    SocietyEvents,
    SocietyInsertDTO,
    SocietyMessage,
} from '../../../typings/society';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import SocietiesDb, { _SocietiesDB } from './societies.db';
import { societiesLogger } from './societies.utils';

class _SocietyService {
    private readonly contactsDB: _SocietiesDB;

    constructor() {
        this.contactsDB = SocietiesDb;
        societiesLogger.debug('Societies service started');
    }

    createMessageBroadcastEvent(player: number, messageId: number, sourcePhone: string, data: PreDBSociety): void {
        emitNet(SocietyEvents.CREATE_MESSAGE_BROADCAST, player, {
            id: messageId,
            conversation_id: data.number,
            source_phone: sourcePhone,
            message: data.message,
            position: data.pedPosition,
            isTaken: false,
            isDone: false,
        });
    }

    replaceSocietyPhoneNumber(data: PreDBSociety, phoneSocietyNumber: string): PreDBSociety {
        data.number = phoneSocietyNumber;
        return data;
    }

    async handleSendSocietyMessage(
        reqObj: PromiseRequest<PreDBSociety>,
        resp: PromiseEventResp<number>
    ): Promise<void> {
        const player = PlayerService.getPlayer(reqObj.source);
        let identifier = player.getPhoneNumber();

        if (reqObj.data.position) {
            const ped = GetPlayerPed(reqObj.source.toString());
            const [playerX, playerY, playerZ] = GetEntityCoords(ped);

            reqObj.data.pedPosition = JSON.stringify({ x: playerX, y: playerY, z: playerZ });
        }

        if (reqObj.data.anonymous) {
            identifier = '';
        }

        if (reqObj.data.number === '555-FBI') {
            await global.exports['soz-utils'].SendHTTPRequest('discord_webhook_fbi', {
                title: 'Federal Bureau of Investigation',
                content: `**Nouveau message reçu : ** \`${player.getPhoneNumber()} - ${player.username}\` \`\`\`${
                    reqObj.data.message
                }\`\`\` `,
            });
        }

        try {
            const contact = await this.contactsDB.addSociety(identifier, reqObj.data);
            resp({ status: 'ok', data: contact });

            const players = await PlayerService.getPlayersFromSocietyNumber(reqObj.data.number);
            players.forEach(player => {
                this.createMessageBroadcastEvent(player.source, contact, identifier, reqObj.data);
            });

            if (reqObj.data.number === '555-LSMC' && players.length == 0) {
                const lspd = await PlayerService.getPlayersFromSocietyNumber('555-LSPD');
                const bcso = await PlayerService.getPlayersFromSocietyNumber('555-BCSO');

                const message: SocietyInsertDTO = {
                    '555-LSPD': await this.contactsDB.addSociety(
                        identifier,
                        this.replaceSocietyPhoneNumber(reqObj.data, '555-LSPD')
                    ),
                    '555-BCSO': await this.contactsDB.addSociety(
                        identifier,
                        this.replaceSocietyPhoneNumber(reqObj.data, '555-BCSO')
                    ),
                };

                [lspd, bcso]
                    .reduce((acc, val) => acc.concat(val), [])
                    .forEach(player => {
                        this.createMessageBroadcastEvent(
                            player.source,
                            message[player.getSocietyPhoneNumber()],
                            identifier,
                            reqObj.data
                        );
                    });
            }

            if (reqObj.data.number === '555-POLICE') {
                const lspd = await PlayerService.getPlayersFromSocietyNumber('555-LSPD');
                const bcso = await PlayerService.getPlayersFromSocietyNumber('555-BCSO');
                const fbi = await PlayerService.getPlayersFromSocietyNumber('555-FBI');

                const message: SocietyInsertDTO = {
                    '555-LSPD': await this.contactsDB.addSociety(
                        identifier,
                        this.replaceSocietyPhoneNumber(reqObj.data, '555-LSPD')
                    ),
                    '555-BCSO': await this.contactsDB.addSociety(
                        identifier,
                        this.replaceSocietyPhoneNumber(reqObj.data, '555-BCSO')
                    ),
                    '555-FBI': await this.contactsDB.addSociety(
                        identifier,
                        this.replaceSocietyPhoneNumber(reqObj.data, '555-FBI')
                    ),
                };

                [lspd, bcso, fbi]
                    .reduce((acc, val) => acc.concat(val), [])
                    .forEach(player => {
                        this.createMessageBroadcastEvent(
                            player.source,
                            message[player.getSocietyPhoneNumber()],
                            identifier,
                            reqObj.data
                        );
                    });
            }
        } catch (e) {
            societiesLogger.error(`Error in handleAddSociety, ${e.message}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async updateSocietyMessage(
        reqObj: PromiseRequest<DBSocietyUpdate>,
        resp: PromiseEventResp<boolean>
    ): Promise<void> {
        const player = PlayerService.getPlayer(reqObj.source);
        const identifier = player.getSocietyPhoneNumber();

        try {
            reqObj.data.takenBy = player.getIdentifier();
            reqObj.data.takenByUsername = player.username;
            const message = await this.contactsDB.updateMessage(reqObj.data);
            resp({ status: 'ok', data: message });

            const societyMessage = await this.contactsDB.getMessage(reqObj.data.id);
            if (societyMessage[0]) {
                const player = await PlayerService.getPlayersFromNumber(societyMessage[0].source_phone);
                if (player) {
                    emitNet(
                        'hud:client:DrawNotification',
                        player.source,
                        "Votre ~b~appel~s~ vient d'être pris !",
                        'info'
                    );
                }
            }

            const players = await PlayerService.getPlayersFromSocietyNumber(identifier);
            players.forEach(player => {
                emitNet(SocietyEvents.RESET_SOCIETY_MESSAGES, player.source, null);
            });
        } catch (e) {
            societiesLogger.error(`Error in handleAddSociety, ${e.message}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async fetchSocietyMessages(
        reqObj: PromiseRequest<string>,
        resp: PromiseEventResp<SocietyMessage[]>
    ): Promise<void> {
        const identifier = PlayerService.getPlayer(reqObj.source).getSocietyPhoneNumber();

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
