import { darkweb_conversations } from '@prisma/client';
import { Provider } from '@public/core/decorators/provider';
import { Notifier } from '@public/server/notifier';

import { Inject } from '../../../core/decorators/injectable';
import { Rpc } from '../../../core/decorators/rpc';
import { ClientEvent } from '../../../shared/event/client';
import { DarkwebConversationUpdate, THREAD_PRICE } from '../../../shared/phone/apps/darkweb';
import { RpcServerEvent } from '../../../shared/rpc';
import { PrismaService } from '../../database/prisma.service';
import { InventoryFactory } from '../../inventory/inventory.factory';
import { PlayerMoneyService } from '../../player/player.money.service';
import { PlayerService } from '../../player/player.service';

const DARKWEB_ITEM = 'cyber_darkweb_module';

@Provider()
export class PhoneAppDarkWebProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(InventoryFactory)
    private readonly inventoryFactory: InventoryFactory;

    @Inject(PlayerMoneyService)
    private readonly playerMoneyService: PlayerMoneyService;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Rpc(RpcServerEvent.PHONE_APP_DARKWEB_GET_CONVERSATIONS)
    async getConversations(source: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        if (!inventory.hasEnoughItem(DARKWEB_ITEM, 1, true)) {
            return;
        }

        const conversations: darkweb_conversations[] = await this.prismaService.darkweb_conversations.findMany({
            distinct: ['id'],
            where: {
                masked: false,
                updatedAt: {
                    gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        return conversations.map(conversation => ({
            ...conversation,
            updatedAt: conversation.updatedAt.getTime(),
            createdAt: conversation.createdAt.getTime(),
        }));
    }

    @Rpc(RpcServerEvent.PHONE_APP_DARKWEB_CREATE_CONVERSATION)
    async createConversation(source: number, label: string, password: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        if (!inventory.hasEnoughItem(DARKWEB_ITEM, 1, true)) {
            return;
        }

        if (!label || !password) {
            return;
        }

        if (!this.playerMoneyService.remove(source, THREAD_PRICE, 'marked_money')) {
            this.notifier.error(source, "Vous n'avez pas assez d'argent");
            return;
        }

        const conversation = await this.prismaService.darkweb_conversations.create({
            data: {
                label,
                password,
                user_identifier: player.charinfo.phone,
            },
        });

        await this.prismaService.darkweb_participants.create({
            data: {
                conversation_id: conversation.id,
                user_identifier: player.citizenid,
                role: 'ADMIN',
                phoneNumber: player.charinfo.phone,
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_APP_DARKWEB_UPDATE_CONVERSATION)
    async updateConversation(source: number, conversationId: number, conversation: Partial<DarkwebConversationUpdate>) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        if (!inventory.hasEnoughItem(DARKWEB_ITEM, 1, true)) {
            return;
        }

        await this.prismaService.darkweb_conversations.update({
            where: {
                id: conversationId,
            },
            data: conversation,
        });
    }

    @Rpc(RpcServerEvent.PHONE_APP_DARKWEB_UPDATE_PARTICIPANT_ROLE)
    async updateParticipantRole(source: number, conversationId: number, phoneNumber: string, role: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const target = this.playerService.getPlayerByPhone(phoneNumber);
        if (!target) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        if (!inventory.hasEnoughItem(DARKWEB_ITEM, 1, true)) {
            return;
        }

        await this.prismaService.darkweb_participants.upsert({
            where: {
                user_identifier_conversation_id: {
                    conversation_id: conversationId,
                    user_identifier: target.citizenid,
                },
            },
            create: {
                conversation_id: conversationId,
                user_identifier: target.citizenid,
                phoneNumber,
                role,
            },
            update: {
                role,
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_APP_DARKWEB_UPDATE_PARTICIPANT_NOTIFICATION)
    async updateParticipantNotification(source: number, conversationId: number, enabled: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        if (!inventory.hasEnoughItem(DARKWEB_ITEM, 1, true)) {
            return;
        }

        await this.prismaService.darkweb_participants.upsert({
            where: {
                user_identifier_conversation_id: {
                    conversation_id: conversationId,
                    user_identifier: player.citizenid,
                },
            },
            create: {
                conversation_id: conversationId,
                user_identifier: player.citizenid,
                notification: enabled,
                phoneNumber: player.charinfo.phone,
                role: 'USER',
            },
            update: {
                notification: enabled,
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_APP_DARKWEB_SET_CONVERSATION_AS_READ)
    async setConversationAsRead(source: number, conversationId: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        if (!inventory.hasEnoughItem(DARKWEB_ITEM, 1, true)) {
            return;
        }

        await this.prismaService.darkweb_participants.updateMany({
            where: {
                conversation_id: conversationId,
                user_identifier: player.citizenid,
            },
            data: {
                unread: false,
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_APP_DARKWEB_GET_PARTICIPANTS)
    async getParticipants(source: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        if (!inventory.hasEnoughItem(DARKWEB_ITEM, 1, true)) {
            return;
        }

        return this.prismaService.darkweb_participants.findMany();
    }

    @Rpc(RpcServerEvent.PHONE_APP_DARKWEB_GET_MESSAGES)
    async getMessages(source: number, conversationId: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        if (!inventory.hasEnoughItem(DARKWEB_ITEM, 1, true)) {
            return;
        }

        const messages = await this.prismaService.darkweb_messages.findMany({
            distinct: ['id'],
            where: {
                conversation_id: conversationId,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return messages.map(message => ({ ...message, createdAt: message.createdAt.getTime() }));
    }

    @Rpc(RpcServerEvent.PHONE_APP_DARKWEB_SEND_MESSAGE)
    async sendMessage(source: number, conversationId: number, message: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        if (!inventory.hasEnoughItem(DARKWEB_ITEM, 1, true)) {
            return;
        }

        if (!message) {
            return;
        }

        const messageData = await this.prismaService.darkweb_messages.create({
            data: {
                conversation_id: conversationId,
                user_identifier: player.charinfo.phone,
                phoneNumber: player.charinfo.phone,
                message,
            },
        });

        const participants = await this.prismaService.darkweb_participants.findMany({
            select: {
                user_identifier: true,
            },
            where: {
                conversation_id: conversationId,
            },
        });

        participants.forEach(participant => {
            const player = this.playerService.getPlayerByCitizenId(participant.user_identifier);
            if (!player) return;

            TriggerClientEvent(ClientEvent.PHONE_APP_DARKWEB_RECEIVE_MESSAGE, player.source, {
                ...messageData,
                createdAt: messageData.createdAt.getTime(),
                updatedAt: messageData.updatedAt.getTime(),
            });
        });
    }
}
