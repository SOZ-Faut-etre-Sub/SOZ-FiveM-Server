import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { ClientEvent } from '../../../shared/event/client';
import { NuiEvent } from '../../../shared/event/nui';
import { PhotoItem } from '../../../shared/phone/apps/photos';
import { RpcServerEvent } from '../../../shared/rpc';
import { NuiDispatch } from '../../nui/nui.dispatch';
import { PhoneState } from '../phone.state';

@Provider()
export class PhoneAppPhotosProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(PhoneState)
    private readonly phoneState: PhoneState;

    @Once(OnceStep.NuiLoaded)
    @OnEvent(ClientEvent.ADMIN_SWITCH_CHARACTER)
    async onNuiLoaded() {
        const photos = await emitRpc<PhotoItem[]>(RpcServerEvent.PHONE_APP_PHOTOS_GET);
        this.nuiDispatch.dispatch('phone', 'AppPhotosSetData', photos);
    }

    @OnNuiEvent(NuiEvent.PhoneAppPhotosUpload)
    async onTakePhoto(url: string) {
        const photo = await emitRpc<PhotoItem>(RpcServerEvent.PHONE_APP_PHOTOS_UPLOAD, url);
        this.nuiDispatch.dispatch('phone', 'AppPhotosAddData', photo);
    }

    @OnNuiEvent(NuiEvent.PhoneAppPhotosDelete)
    async onDeletePhoto(id: string) {
        await emitRpc(RpcServerEvent.PHONE_APP_PHOTOS_DELETE, id);
    }

    @OnNuiEvent(NuiEvent.PhoneAppPhotosToggleCamera)
    async onToggleCamera() {
        this.phoneState.setPhoneFrontCameraEnabled(!this.phoneState.isPhoneFrontCameraEnabled());
    }

    @OnNuiEvent(NuiEvent.PhoneAppPhotosEnterCamera)
    async onEnterCamera() {
        this.phoneState.setPhoneOnCamera(true);
        CreateMobilePhone(1);
        CellCamActivate(true, true);
    }

    @OnNuiEvent(NuiEvent.PhoneAppPhotosExitCamera)
    async onExitCamera() {
        this.phoneState.setPhoneOnCamera(false);
        CellCamActivate(false, false);
        DestroyMobilePhone();
        this.nuiDispatch.dispatch('phone', 'SetPhoneFreeCamera', false);
    }
}
