import { Provider } from '@core/decorators/provider';
import { Inject } from '@public/core/decorators/injectable';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { emitRpc } from '../../core/rpc';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { Contact, ContactDTO } from '../../shared/phone/simcard';
import { RpcServerEvent } from '../../shared/rpc';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';

@Provider()
export class PhoneSimCardContacts {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Once(OnceStep.NuiLoaded)
    @OnEvent(ClientEvent.ADMIN_SWITCH_CHARACTER)
    async onNuiLoaded() {
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        const contacts = await emitRpc<Contact[]>(RpcServerEvent.PHONE_SIMCARD_CONTACTS_GET);
        this.nuiDispatch.dispatch('phone', 'SetContacts', contacts);
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardAddContact)
    async onAddContact({ ...contact }: ContactDTO) {
        const newContact = await emitRpc<Contact>(RpcServerEvent.PHONE_SIMCARD_CONTACTS_ADD, contact);
        this.nuiDispatch.dispatch('phone', 'AddContact', newContact);
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardUpdateContact)
    async onUpdateContact({ id, ...contact }: ContactDTO & { id: number }) {
        const updatedContact = await emitRpc<Contact>(RpcServerEvent.PHONE_SIMCARD_CONTACTS_UPDATE, id, contact);
        this.nuiDispatch.dispatch('phone', 'UpdateContact', updatedContact);
    }

    @OnNuiEvent(NuiEvent.PhoneSimCardDeleteContact)
    async onDeleteContact(id: number) {
        const deletedContact = await emitRpc<Contact>(RpcServerEvent.PHONE_SIMCARD_CONTACTS_REMOVE, id);
        this.nuiDispatch.dispatch('phone', 'RemoveContact', deletedContact.id);
    }
}
