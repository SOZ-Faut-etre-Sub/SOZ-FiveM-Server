import { Prisma } from '@prisma/client';
import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent } from '../../shared/event/client';
import { MessageConversation } from '../../shared/phone/simcard';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { PlayerService } from '../player/player.service';

@Provider()
export class PhoneSimCardMessages {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Rpc(RpcServerEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_GET)
    async getConversations(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const conversations = await this.prismaService.$queryRaw<
            {
                unread: number;
                conversation_id: string;
                masked: number;
                user_identifier: string;
                participant_identifier: string;
                avatar: string;
                updatedAt: any;
            }[]
        >(
            Prisma.sql`
                SELECT DISTINCT phone_messages_conversations.unread,
                                phone_messages_conversations.conversation_id,
                                phone_messages_conversations.masked,
                                phone_messages_conversations.user_identifier,
                                phone_messages_conversations.participant_identifier,
                                phone_profile.avatar,
                                phone_messages_conversations.updatedAt
                FROM phone_messages_conversations
                         LEFT OUTER JOIN phone_profile
                                         ON phone_profile.number = phone_messages_conversations.participant_identifier
                WHERE phone_messages_conversations.user_identifier = ${player.charinfo.phone}
                  AND phone_messages_conversations.updatedAt >= DATE_SUB(NOW(), INTERVAL 14 DAY)
                ORDER BY phone_messages_conversations.updatedAt DESC
            `
        );

        return conversations.map(
            (conversation: any) =>
                ({
                    unread: conversation.unread,
                    conversation_id: conversation.conversation_id,
                    masked: conversation.masked === 1,
                    phoneNumber: conversation.participant_identifier,
                    display: conversation.display,
                    avatar: conversation.avatar,
                    updatedAt: Number(conversation.updatedAt),
                }) as MessageConversation
        );
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_ADD)
    async createConversation(source: number, phoneNumber: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const conversationId = [player.charinfo.phone, phoneNumber].sort().join('+');

        const conversationExists = await this.prismaService.phone_messages_conversations.findFirst({
            where: {
                conversation_id: conversationId,
                user_identifier: player.charinfo.phone,
            },
        });

        if (conversationExists) {
            await this.prismaService.phone_messages_conversations.update({
                where: {
                    id: conversationExists.id,
                    conversation_id: conversationId,
                    user_identifier: player.charinfo.phone,
                },
                data: {
                    masked: false,
                    updatedAt: new Date(),
                },
            });

            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_RELOAD, source);

            return conversationExists;
        }

        await this.prismaService.phone_messages_conversations.create({
            data: {
                conversation_id: conversationId,
                user_identifier: player.charinfo.phone,
                participant_identifier: phoneNumber,
            },
        });
        await this.prismaService.phone_messages_conversations.create({
            data: {
                conversation_id: conversationId,
                user_identifier: phoneNumber,
                participant_identifier: player.charinfo.phone,
            },
        });

        const targetPlayer = this.playerService.getPlayerByPhone(phoneNumber);
        if (targetPlayer) {
            TriggerClientEvent(ClientEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_RELOAD, targetPlayer.source);
        }

        return {
            conversation_id: conversationId,
        };
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_SET_READ)
    async setConversationRead(source: number, conversationId: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const conversation = await this.prismaService.phone_messages_conversations.findFirst({
            where: {
                conversation_id: conversationId,
                user_identifier: player.charinfo.phone,
            },
        });

        await this.prismaService.phone_messages_conversations.updateMany({
            where: {
                conversation_id: conversationId,
                user_identifier: player.charinfo.phone,
            },
            data: {
                unread: 0,
                updatedAt: conversation.updatedAt,
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_ARCHIVE)
    async archiveConversation(source: number, conversationId: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        await this.prismaService.phone_messages_conversations.updateMany({
            where: {
                conversation_id: conversationId,
                user_identifier: player.charinfo.phone,
            },
            data: {
                masked: true,
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_MESSAGES_GET)
    async getMessages(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const messages = await this.prismaService.$queryRaw<
            {
                id: number;
                conversation_id: string;
                message: string;
                author: string;
                createdAt: any;
            }[]
        >(
            Prisma.sql`SELECT DISTINCT phone_messages.id,
                                       phone_messages.conversation_id,
                                       phone_messages.message,
                                       phone_messages.author,
                                       phone_messages.createdAt
                       FROM phone_messages
                                LEFT JOIN phone_messages_conversations ON phone_messages.conversation_id = phone_messages_conversations.conversation_id
                       WHERE phone_messages_conversations.participant_identifier = ${player.charinfo.phone}
                         AND phone_messages.updatedAt >= DATE_SUB(NOW(), INTERVAL 14 DAY)
                       ORDER BY id DESC`
        );

        return messages.map((message: any) => ({
            ...message,
            createdAt: Number(message.createdAt),
        }));
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_MESSAGES_SEND)
    async sendMessage(source: number, conversationId: string, message: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const [createdMessage] = await this.prismaService.$transaction([
            this.prismaService.phone_messages.create({
                data: {
                    user_identifier: player.citizenid,
                    author: player.charinfo.phone,
                    conversation_id: conversationId,
                    message,
                },
            }),
            this.prismaService.phone_messages_conversations.updateMany({
                where: {
                    conversation_id: conversationId,
                    user_identifier: {
                        not: player.charinfo.phone,
                    },
                },
                data: {
                    unread: {
                        increment: 1,
                    },
                },
            }),
            this.prismaService.phone_messages_conversations.updateMany({
                where: {
                    conversation_id: conversationId,
                },
                data: {
                    masked: false,
                    updatedAt: new Date(),
                },
            }),
        ]);

        const createdMessageData = { ...createdMessage, createdAt: Number(createdMessage.createdAt) };

        for (const phoneNumber of conversationId.split('+')) {
            const targetPlayer = this.playerService.getPlayerByPhone(phoneNumber);
            if (targetPlayer) {
                TriggerClientEvent(
                    ClientEvent.PHONE_SIMCARD_MESSAGES_MESSAGE_NEW,
                    targetPlayer.source,
                    createdMessageData
                );
            }
        }
    }
}
