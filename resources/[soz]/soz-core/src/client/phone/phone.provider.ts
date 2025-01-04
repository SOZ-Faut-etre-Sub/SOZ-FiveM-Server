import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class PhoneProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Once(OnceStep.NuiLoaded)
    async onNuiLoaded() {
        this.nuiDispatch.dispatch('phone', 'SetAvailability', true);
    }

    @Tick(TickInterval.EVERY_SECOND)
    async onTick() {
        const ped = PlayerPedId();
        const isSwimming = IsPedSwimming(ped);

        // if (isSwimming && !global.isPhoneDrowned) {
        //     global.isPhoneDrowned = true;
        //     updateAvailability();
        // } else if (!isSwimming && global.isPhoneDrowned) {
        //     global.isPhoneDrowned = false;
        //     updateAvailability();
        // }
        //
        // if (global.isBlackout != cityIsInBlackOut()) {
        //     global.isBlackout = cityIsInBlackOut();
        //     updateAvailability();
        // }
        //
        // if (exports['soz-core'].IsDoingAction()) {
        //     if (global.isPhoneOpen) {
        //         await hidePhone();
        //     }
        // }
    }

    @Tick(TickInterval.EVERY_SECOND * 2)
    async updateTime() {
        const hour: number = GetClockHours();
        const minute: number = GetClockMinutes();

        this.nuiDispatch.dispatch(
            'phone',
            'SetTime',
            `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
        );
    }
}
