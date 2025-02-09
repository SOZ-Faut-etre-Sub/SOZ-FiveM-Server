import { Inject } from '@core/decorators/injectable';
import { Rpc } from '@core/decorators/rpc';
import { phone_society_messages } from '@prisma/client';
import { SocietyNumberList } from '@public/config/phone';
import { Provider } from '@public/core/decorators/provider';
import { Notifier } from '@public/server/notifier';
import { ClientEvent } from '@public/shared/event/client';
import { JobType } from '@public/shared/job';
import {
    NewSocietyMessage,
    SocietyMessage,
    SocietyMessageInfo,
    UpdateSocietyMessage,
} from '@public/shared/phone/apps/society';
import { PlayerData } from '@public/shared/player';
import { toVector3Object, Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';
import { subDays } from 'date-fns';

import { ApiPhoneProvider } from '../../api/api.phone.provider';
import { PrismaService } from '../../database/prisma.service';
import { PlayerService } from '../../player/player.service';
import { ServerStateService } from '../../server.state.service';

@Provider()
export class PhoneAppSocietyProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(ApiPhoneProvider)
    private readonly apiPhoneProvider: ApiPhoneProvider;

    @Inject(ServerStateService)
    private readonly serverStateService: ServerStateService;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    private policeMessageCount = 0;

    @Rpc(RpcServerEvent.PHONE_APP_SOCIETY_GET)
    async getMessages(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const messages = await this.prismaService.phone_society_messages.findMany({
            where: {
                conversation_id: SocietyNumberList[player.job.id],
                createdAt: {
                    gte: subDays(Date.now(), 2),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return messages.map(this.messageMapper);
    }

    @Rpc(RpcServerEvent.PHONE_APP_SOCIETY_SEND_MESSAGE)
    async sendMessage(source: number, message: NewSocietyMessage) {
        const player = this.playerService.getPlayer(source);

        const username = message.overrideIdentifier ?? `${player?.charinfo?.firstname} ${player?.charinfo?.lastname}`;
        const identifier = (message.anonymous ? '#' : '') + (message.overrideIdentifier ?? player?.charinfo?.phone);

        let position = message.position
            ? JSON.stringify(toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3))
            : null;

        if (message.pedPosition) {
            position = JSON.stringify(message.pedPosition);
        }

        if (message.number === SocietyNumberList.fbi && username) {
            await this.apiPhoneProvider.sendFbiMessage(player, message.message);
        }

        const societyMessage = await this.prismaService.phone_society_messages.create({
            data: {
                conversation_id: message.number,
                source_phone: identifier,
                message: message.message,
                position,
                type: message?.type ?? null,
            },
        });

        const messageInfo: SocietyMessageInfo = {
            type: message?.type ?? '',
        };

        if (
            [
                SocietyNumberList.lspd,
                SocietyNumberList.bcso,
                SocietyNumberList.sasp,
                SocietyNumberList.lscs,
                '555-POLICE',
            ].includes(message.number)
        ) {
            this.policeMessageCount++;
            messageInfo.notificationId = this.policeMessageCount;
            messageInfo.serviceNumber = message.number;
        }

        const players = this.serverStateService.getPlayersByJob(
            Object.entries(SocietyNumberList).find(([, value]) => value === message.number)?.[0]
        );

        players.forEach(player => this.createMessageBroadcastEvent(player, societyMessage, messageInfo));

        const hasLsmcOnDuty = players.filter(player => player.job.onduty).length > 0;

        if (message.number === SocietyNumberList.lsmc && !hasLsmcOnDuty) {
            for (const society of [JobType.LSPD, JobType.BCSO]) {
                const societyMessage = await this.prismaService.phone_society_messages.create({
                    data: {
                        conversation_id: SocietyNumberList[society],
                        source_phone: identifier,
                        message: `[${message.number.replace('555-', '')}] ${message.message}`,
                        position,
                        type: message?.type ?? null,
                    },
                });

                this.policeMessageCount++;

                messageInfo.notificationId = this.policeMessageCount;
                messageInfo.serviceNumber = message.number;

                this.serverStateService
                    .getPlayersByJob(society)
                    .forEach(player => this.createMessageBroadcastEvent(player, societyMessage, messageInfo));
            }
        }

        if (message.number === '555-POLICE') {
            for (const society of [JobType.LSPD, JobType.BCSO, JobType.SASP, JobType.FBI, JobType.LSCS]) {
                const societyMessage = await this.prismaService.phone_society_messages.create({
                    data: {
                        conversation_id: SocietyNumberList[society],
                        source_phone: identifier,
                        message: `[${message.number.replace('555-', '')}] ${message.message}`,
                        position,
                        type: message?.type ?? null,
                    },
                });

                this.serverStateService
                    .getPlayersByJob(society)
                    .forEach(player => this.createMessageBroadcastEvent(player, societyMessage, messageInfo));
            }
        }
    }

    @Rpc(RpcServerEvent.PHONE_APP_SOCIETY_UPDATE_MESSAGE)
    async updateMessage(source: number, message: UpdateSocietyMessage) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const data: Partial<phone_society_messages> = {};

        if (message.isDone !== undefined) {
            data.isDone = 1;
        }

        if (message.isTaken !== undefined) {
            data.takenBy = player.citizenid;
            data.takenByUsername = `${player.charinfo.firstname} ${player.charinfo.lastname}`;
            data.isTaken = 1;
        }

        const societyMessage = await this.prismaService.phone_society_messages.update({
            where: { id: message.id, conversation_id: SocietyNumberList[player.job.id] },
            data,
        });

        const originalPlayer = this.serverStateService.getPlayerByPhoneNumber(
            societyMessage.source_phone.replace('#', '')
        );
        if (originalPlayer && societyMessage.isTaken && !societyMessage.isDone) {
            this.notifier.notify(
                originalPlayer.source,
                `Votre ~b~appel~s~ au ${societyMessage.conversation_id} vient d'être pris !`,
                'info',
                10000
            );
        }

        this.serverStateService
            .getPlayersByJob(player.job.id)
            .forEach(player =>
                this.createMessageBroadcastEvent(player, societyMessage, { type: societyMessage?.type ?? '' })
            );

        return this.messageMapper(societyMessage);
    }

    private createMessageBroadcastEvent(
        player: PlayerData,
        message: phone_society_messages,
        messageInfo: SocietyMessageInfo
    ) {
        const messageData = {
            ...this.messageMapper(message),
            muted: !player.job.onduty,
            info: messageInfo,
        };

        TriggerClientEvent(ClientEvent.PHONE_APP_SOCIETY_RECEIVE_MESSAGE, player.source, messageData);
    }

    private messageMapper(message: phone_society_messages): SocietyMessage {
        return {
            ...message,
            createdAt: message.createdAt.getTime(),
            updatedAt: message.updatedAt.getTime(),
            isDone: message.isDone === 1,
            isTaken: message.isTaken === 1,
            info: { type: message.type ?? '' },
            source_phone: message.source_phone.startsWith('#') ? '' : message.source_phone,
        };
    }
}
