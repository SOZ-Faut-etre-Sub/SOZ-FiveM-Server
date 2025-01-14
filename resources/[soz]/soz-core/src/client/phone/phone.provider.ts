import { wait } from '@public/core/utils';
import { NuiEvent } from '@public/shared/event/nui';

import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
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

    @OnNuiEvent(NuiEvent.GetWaypoint)
    async getWaypoint() {
        return GetBlipInfoIdCoord(GetFirstBlipInfoId(8));
    }

    @OnNuiEvent(NuiEvent.SetWaypoint)
    async setWaypoint({ x, y }: { x: number; y: number }) {
        SetNewWaypoint(x, y);
    }

    @OnNuiEvent(NuiEvent.GetPlayerPosition)
    async getPlayerPosition() {
        return GetEntityCoords(PlayerPedId(), true);
    }

    @OnNuiEvent(NuiEvent.GetStreetName)
    async getStreetName({ x, y, z }: { x: number; y: number; z: number }) {
        const streets = [];
        const start = Date.now();

        while (!AreNodesLoadedForArea(x - 100, y - 100, x + 100, y + 100)) {
            await wait(0);
            Citizen.invokeNative('0x2ee5fff3e1e3400d', x - 100, y - 100, x + 100, y + 100); //REQUEST_PATH_NODES_IN_AREA_THIS_FRAME
            if (Date.now() - start > 5000) {
                break;
            }
        }

        const [streetA, streetB] = GetStreetNameAtCoord(x, y, z);
        streets.push(GetStreetNameFromHashKey(streetA));

        if (streetB && streetA !== streetB) {
            streets.push(GetStreetNameFromHashKey(streetB));
        }

        return streets;
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

        this.nuiDispatch.dispatch('phone', 'SetTime', { hour, minute });
    }
}
