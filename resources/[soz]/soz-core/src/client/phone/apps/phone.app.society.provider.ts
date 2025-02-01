import { On, Once, OnceStep, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { emitRpc } from '@core/rpc';
import { Provider } from '@public/core/decorators/provider';
import { ClientEvent } from '@public/shared/event/client';
import { NuiEvent } from '@public/shared/event/nui';
import { NewSocietyMessage, SocietyMessage, UpdateSocietyMessage } from '@public/shared/phone/apps/society';
import { RpcServerEvent } from '@public/shared/rpc';

import { NuiDispatch } from '../../nui/nui.dispatch';

@Provider()
export class PhoneAppSocietyProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Once(OnceStep.NuiLoaded)
    async onNuiLoaded() {
        await this.fetchSocietyMembers();
    }

    @On('QBCore:Client:OnJobUpdate')
    async onJobUpdate() {
        await this.fetchSocietyMembers();
    }

    @On(ClientEvent.PHONE_APP_SOCIETY_RECEIVE_MESSAGE)
    async onNewSocietyMessage(message: SocietyMessage) {
        this.nuiDispatch.dispatch('phone', 'AppSocietyPatchData', message);
    }

    @OnNuiEvent(NuiEvent.PhoneAppSocietySendMessage)
    async sendMessage(message: NewSocietyMessage) {
        return emitRpc(RpcServerEvent.PHONE_APP_SOCIETY_SEND_MESSAGE, message);
    }

    @OnNuiEvent(NuiEvent.PhoneAppSocietyUpdateMessage)
    async onUpdateMessage(message: UpdateSocietyMessage) {
        return emitRpc(RpcServerEvent.PHONE_APP_SOCIETY_UPDATE_MESSAGE, message);
    }

    private async fetchSocietyMembers() {
        const messages = await emitRpc<SocietyMessage[]>(RpcServerEvent.PHONE_APP_SOCIETY_GET);
        this.nuiDispatch.dispatch('phone', 'AppSocietySetData', messages);
    }
}
