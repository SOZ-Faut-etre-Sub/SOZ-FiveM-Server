import { Provider } from '@core/decorators/provider';
import { Inject } from '@public/core/decorators/injectable';
import {
    Message,
    MessageConversation,
    NewMessage,
    NewMessageConversation,
    UpdateMessageConversation,
} from '@public/shared/phone/simcard';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { emitRpc } from '../../core/rpc';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { RpcServerEvent } from '../../shared/rpc';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';

@Provider()
export class PhoneSimCardMessages {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Once(OnceStep.NuiLoaded)
    async onNuiLoaded() {
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        await this.reloadConversations();

        const messages = await emitRpc<Message[]>(RpcServerEvent.PHONE_SIMCARD_MESSAGES_GET);
        this.nuiDispatch.dispatch('phone', 'SetMessages', messages);
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardAddConversation)
    async addConversation(conversation: NewMessageConversation) {
        const addedConversation = await emitRpc<MessageConversation>(
            RpcServerEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_ADD,
            conversation.phoneNumber
        );

        await this.reloadConversations();

        return {
            conversation_id: addedConversation.conversation_id,
        };
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardArchiveConversation)
    async archiveConversation(conversation_id: string) {
        await emitRpc<MessageConversation>(RpcServerEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_ARCHIVE, conversation_id);
        await this.reloadConversations();
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardSetConversationAsRead)
    async setConversationRead(conversation_id: string) {
        await emitRpc<MessageConversation>(
            RpcServerEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_SET_READ,
            conversation_id
        );
        await this.reloadConversations();
    }

    @OnEvent(ClientEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_RELOAD)
    async reloadConversations() {
        const conversations = await emitRpc<MessageConversation[]>(
            RpcServerEvent.PHONE_SIMCARD_MESSAGES_CONVERSATION_GET
        );
        this.nuiDispatch.dispatch('phone', 'SetConversations', conversations);
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardSendMessage)
    async sendMessage(message: NewMessage) {
        await emitRpc<Message>(RpcServerEvent.PHONE_SIMCARD_MESSAGES_SEND, message.conversation_id, message.message);
    }

    @OnEvent(ClientEvent.PHONE_SIMCARD_MESSAGES_MESSAGE_NEW)
    async newMessage(message: Message) {
        this.nuiDispatch.dispatch('phone', 'AddMessage', message);
    }
}
