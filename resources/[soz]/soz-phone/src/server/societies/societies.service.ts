import axios from 'axios';

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
    private readonly qbCore: any;
    private policeMessageCount: number;

    constructor() {
        this.contactsDB = SocietiesDb;
        societiesLogger.debug('Societies service started');
        this.qbCore = global.exports['qb-core'].GetCoreObject();
        this.policeMessageCount = 0;
    }

    createMessageBroadcastEvent(player: number, messageId: number, sourcePhone: string, data: PreDBSociety): void {
        const qbCorePlayer = this.qbCore.Functions.GetPlayer(player);

        const messageData = {
            id: messageId,
            conversation_id: data.number,
            source_phone: sourcePhone.includes('#') ? '' : sourcePhone,
            message: data.message,
            htmlMessage: data.htmlMessage,
            position: data.pedPosition,
            isTaken: false,
            isDone: false,
            muted: !qbCorePlayer.PlayerData.job.onduty,
            createdAt: new Date().getTime(),
            info: data.info,
        };

        emitNet(SocietyEvents.CREATE_MESSAGE_BROADCAST, player, messageData);
    }

    replaceSocietyPhoneNumber(data: PreDBSociety, phoneSocietyNumber: string): PreDBSociety {
        data.number = phoneSocietyNumber;
        return data;
    }

    addTagForSocietyMessage(data: PreDBSociety, number: string): PreDBSociety {
        const msg = { ...data };
        msg.message = `[${number.replace('555-', '')}] ${msg.message}`;
        return msg;
    }

    async handleSendSocietyMessage(
        reqObj: PromiseRequest<PreDBSociety>,
        resp: PromiseEventResp<number>
    ): Promise<void> {
        let username: string = null;
        let identifier: string = null;
        if (reqObj.data.overrideIdentifier) {
            username = reqObj.data.overrideIdentifier;
            identifier = reqObj.data.overrideIdentifier;
        } else {
            const player = PlayerService.getPlayer(reqObj.source);
            username = player?.username;
            identifier = player.getPhoneNumber();
        }

        const originalMessageNumber = reqObj.data.number;

        if (reqObj.data.position) {
            const ped = GetPlayerPed(reqObj.source.toString());
            const [playerX, playerY, playerZ] = GetEntityCoords(ped);

            reqObj.data.pedPosition = JSON.stringify({ x: playerX, y: playerY, z: playerZ });
        }

        if (reqObj.data.anonymous) {
            identifier = `#${identifier}`;
        }

        if (reqObj.data.number === '555-FBI' && username) {
            const url = GetConvar('soz_api_endpoint', 'https://api.soz.zerator.com') + '/discord/send-fbi';
            await axios.post(
                url,
                {
                    phone: identifier,
                    username: username,
                    data: reqObj.data.message,
                },
                {
                    auth: {
                        username: GetConvar('soz_api_username', 'admin'),
                        password: GetConvar('soz_api_password', 'admin'),
                    },
                }
            );
        }

        try {
            const contact = await this.contactsDB.addSociety(identifier, reqObj.data);
            resp({ status: 'ok', data: contact });

            if (['555-LSPD', '555-BCSO', '555-SASP', '555-POLICE'].includes(reqObj.data.number)) {
                this.policeMessageCount++;
                if (!reqObj.data.info) {
                    reqObj.data.info = {};
                }
                reqObj.data.info.notificationId = this.policeMessageCount;
                reqObj.data.info.serviceNumber = reqObj.data.number;
            }

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
                        this.replaceSocietyPhoneNumber(
                            this.addTagForSocietyMessage(reqObj.data, originalMessageNumber),
                            '555-LSPD'
                        )
                    ),
                    '555-BCSO': await this.contactsDB.addSociety(
                        identifier,
                        this.replaceSocietyPhoneNumber(
                            this.addTagForSocietyMessage(reqObj.data, originalMessageNumber),
                            '555-BCSO'
                        )
                    ),
                };

                this.policeMessageCount++;
                if (!reqObj.data.info) {
                    reqObj.data.info = {};
                }
                reqObj.data.info.notificationId = this.policeMessageCount;
                reqObj.data.info.serviceNumber = reqObj.data.number;

                [lspd, bcso]
                    .reduce((acc, val) => acc.concat(val), [])
                    .forEach(player => {
                        this.createMessageBroadcastEvent(
                            player.source,
                            message[player.getSocietyPhoneNumber()],
                            identifier,
                            this.replaceSocietyPhoneNumber(
                                this.addTagForSocietyMessage(reqObj.data, originalMessageNumber),
                                player.getSocietyPhoneNumber()
                            )
                        );
                    });
            }

            if (reqObj.data.number === '555-POLICE') {
                const lspd = await PlayerService.getPlayersFromSocietyNumber('555-LSPD');
                const bcso = await PlayerService.getPlayersFromSocietyNumber('555-BCSO');
                const sasp = await PlayerService.getPlayersFromSocietyNumber('555-SASP');
                const fbi = await PlayerService.getPlayersFromSocietyNumber('555-FBI');

                const message: SocietyInsertDTO = {
                    '555-LSPD': await this.contactsDB.addSociety(
                        identifier,
                        this.replaceSocietyPhoneNumber(
                            this.addTagForSocietyMessage(reqObj.data, originalMessageNumber),
                            '555-LSPD'
                        )
                    ),
                    '555-BCSO': await this.contactsDB.addSociety(
                        identifier,
                        this.replaceSocietyPhoneNumber(
                            this.addTagForSocietyMessage(reqObj.data, originalMessageNumber),
                            '555-BCSO'
                        )
                    ),
                    '555-SASP': await this.contactsDB.addSociety(
                        identifier,
                        this.replaceSocietyPhoneNumber(
                            this.addTagForSocietyMessage(reqObj.data, originalMessageNumber),
                            '555-SASP'
                        )
                    ),
                    '555-FBI': await this.contactsDB.addSociety(
                        identifier,
                        this.replaceSocietyPhoneNumber(
                            this.addTagForSocietyMessage(reqObj.data, originalMessageNumber),
                            '555-FBI'
                        )
                    ),
                };

                [lspd, bcso, fbi, sasp]
                    .reduce((acc, val) => acc.concat(val), [])
                    .forEach(player => {
                        const data = this.addTagForSocietyMessage(reqObj.data, originalMessageNumber);
                        this.createMessageBroadcastEvent(
                            player.source,
                            message[player.getSocietyPhoneNumber()],
                            identifier,
                            data
                        );
                    });
            }
        } catch (e) {
            societiesLogger.error(`Error in handleSendSocietyMessage, ${e.toString()}`);
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
            if (societyMessage) {
                const player = await PlayerService.getPlayersFromNumber(societyMessage.source_phone.replace('#', ''));
                if (player) {
                    if (societyMessage.isTaken && !societyMessage.isDone) {
                        emitNet(
                            'soz-core:client:notification:draw',
                            player.source,
                            `Votre ~b~appel~s~ au ${societyMessage.conversation_id} vient d'être pris !`,
                            'info',
                            10000
                        );
                    }
                }
            }

            if (societyMessage.source_phone.includes('#')) {
                societyMessage.source_phone = '';
            }

            const players = await PlayerService.getPlayersFromSocietyNumber(identifier);
            players.forEach(player => {
                emitNet(SocietyEvents.UPDATE_SOCIETY_MESSAGE_SUCCESS, player.source, societyMessage);
            });
        } catch (e) {
            societiesLogger.error(`Error in updateSocietyMessage, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async fetchSocietyMessages(
        reqObj: PromiseRequest<string>,
        resp: PromiseEventResp<SocietyMessage[]>
    ): Promise<void> {
        const identifier = PlayerService.getPlayer(reqObj.source).getSocietyPhoneNumber();

        try {
            const messages = await this.contactsDB.getMessages(identifier);

            resp({
                status: 'ok',
                data: messages.map(m => ({
                    ...m,
                    source_phone: m.source_phone.includes('#') ? '' : m.source_phone,
                })),
            });
        } catch (e) {
            societiesLogger.error(`Error in fetchSocietyMessages, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }
}

const SocietyService = new _SocietyService();
export default SocietyService;
