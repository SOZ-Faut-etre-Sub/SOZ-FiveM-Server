import { Provider } from '@public/core/decorators/provider';
import { RpcServerEvent } from '@public/shared/rpc';

import { OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { NuiEvent } from '../../../shared/event/nui';
import { DarkwebConversation, PreDBDarkwebMessage } from '../../../shared/phone/apps/darkweb';

@Provider()
export class PhoneAppDarkWebProvider {
    @OnNuiEvent(NuiEvent.PhoneAppDarkWebFetchConversations)
    async fetchConversations() {
        return emitRpc(RpcServerEvent.PHONE_APP_DARKWEB_GET_CONVERSATIONS);
    }

    @OnNuiEvent(NuiEvent.PhoneAppDarkWebAddConversation)
    async addConversation({ label, password }: { label: string; password: string }) {
        await emitRpc(RpcServerEvent.PHONE_APP_DARKWEB_CREATE_CONVERSATION, label, password);
    }

    @OnNuiEvent(NuiEvent.PhoneAppDarkWebUpdateConversation)
    async updateConversation({ id, ...conversation }: Partial<DarkwebConversation>) {
        await emitRpc(RpcServerEvent.PHONE_APP_DARKWEB_UPDATE_CONVERSATION, id, conversation);
    }

    @OnNuiEvent(NuiEvent.PhoneAppDarkWebSetConversationAsRead)
    async setConversationAsRead(conversationId: string) {
        await emitRpc(RpcServerEvent.PHONE_APP_DARKWEB_SET_CONVERSATION_AS_READ, conversationId);
    }

    @OnNuiEvent(NuiEvent.PhoneAppDarkWebUpdateParticipantRole)
    async updateParticipantRole({
        conversationId,
        phoneNumber,
        role,
    }: {
        conversationId: string;
        phoneNumber: string;
        role: string;
    }) {
        await emitRpc(RpcServerEvent.PHONE_APP_DARKWEB_UPDATE_PARTICIPANT_ROLE, conversationId, phoneNumber, role);
    }

    @OnNuiEvent(NuiEvent.PhoneAppDarkWebFetchMessages)
    async fetchMessages(conversationId: string) {
        return emitRpc(RpcServerEvent.PHONE_APP_DARKWEB_GET_MESSAGES, conversationId);
    }

    @OnNuiEvent(NuiEvent.PhoneAppDarkWebSendMessage)
    async sendMessage({ conversationId, message }: PreDBDarkwebMessage) {
        await emitRpc(RpcServerEvent.PHONE_APP_DARKWEB_SEND_MESSAGE, conversationId, message);
    }
}
