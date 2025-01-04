import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { Once, OnceStep, OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { NuiEvent } from '../../../shared/event/nui';
import { NewNoteItem, NoteItem } from '../../../shared/phone/apps/notes';
import { RpcServerEvent } from '../../../shared/rpc';
import { NuiDispatch } from '../../nui/nui.dispatch';

@Provider()
export class PhoneAppNotesProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Once(OnceStep.NuiLoaded)
    async onNuiLoaded() {
        await this.getNotes();
    }

    @OnNuiEvent(NuiEvent.PhoneAppNotesAdd)
    async onPhoneAppNotesAdd({ title, content }: NewNoteItem) {
        await emitRpc(RpcServerEvent.PHONE_APP_NOTES_ADD, title, content);
        await this.getNotes();
    }

    @OnNuiEvent(NuiEvent.PhoneAppNotesUpdate)
    async onPhoneAppNotesUpdate({ id, content, title }: NoteItem) {
        await emitRpc(RpcServerEvent.PHONE_APP_NOTES_UPDATE, id, title, content);
        await this.getNotes();
    }

    @OnNuiEvent(NuiEvent.PhoneAppNotesDelete)
    async onPhoneAppNotesDelete(id: NoteItem['id']) {
        await emitRpc(RpcServerEvent.PHONE_APP_NOTES_DELETE, id);
        await this.getNotes();
    }

    protected async getNotes() {
        const notes = await emitRpc<NoteItem[]>(RpcServerEvent.PHONE_APP_NOTES_GET);
        this.nuiDispatch.dispatch('phone', 'AppNotesSetData', notes);
    }
}
