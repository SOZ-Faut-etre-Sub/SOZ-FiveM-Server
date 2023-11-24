import { Once } from '@public/core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';

import { Provider } from '../../core/decorators/provider';

@Provider()
export class UtilsProvider {
    @Once()
    public onStart() {
        DisableIdleCamera(true);
        DisableVehiclePassengerIdleCamera(true);
        SetPlayerHealthRechargeLimit(PlayerId(), 0);
        SetFlashLightKeepOnWhileMoving(true);
        StartAudioScene('CHARACTER_CHANGE_IN_SKY_SCENE');
        SetAudioFlag('PoliceScannerDisabled', true);
        SetMaxWantedLevel(0);
    }

    @Exportable('GetTimestamp')
    public GetTimestamp() {
        return new Date().getTime();
    }
}
