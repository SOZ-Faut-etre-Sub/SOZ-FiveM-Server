import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { Once, OnceStep, OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { NuiEvent } from '../../../shared/event/nui';
import { PhotoItem } from '../../../shared/phone/apps/photos';
import { RpcServerEvent } from '../../../shared/rpc';
import { NuiDispatch } from '../../nui/nui.dispatch';

@Provider()
export class PhoneAppPhotosProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Once(OnceStep.NuiLoaded)
    async onNuiLoaded() {
        const photos = await emitRpc<PhotoItem[]>(RpcServerEvent.PHONE_APP_PHOTOS_GET);
        this.nuiDispatch.dispatch('phone', 'AppPhotosSetData', photos);
    }

    @OnNuiEvent(NuiEvent.PhoneAppPhotosDelete)
    async onDeletePhoto(id: string) {
        await emitRpc(RpcServerEvent.PHONE_APP_PHOTOS_DELETE, id);
    }
}
