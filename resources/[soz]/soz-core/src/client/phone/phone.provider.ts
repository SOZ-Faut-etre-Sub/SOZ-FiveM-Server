import { wait } from '@public/core/utils';
import { NuiEvent } from '@public/shared/event/nui';
import { ServerEvent } from '@public/shared/event/server';

import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { LSMCDeathProvider } from '../job/lsmc/lsmc.death.provider';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PhoneManager } from './phone.manager';

@Provider()
export class PhoneProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(LSMCDeathProvider)
    private readonly lsmcDeathProvider: LSMCDeathProvider;

    @Inject(PhoneManager)
    private readonly phoneManager: PhoneManager;

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

    @OnNuiEvent(NuiEvent.DeleteWaypoint)
    async deleteWaypoint() {
        DeleteWaypoint();
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

    @OnNuiEvent(NuiEvent.PhoneEmergencyCallLSMC)
    async phoneEmergencyCallLSMC() {
        this.lsmcDeathProvider.call();
    }

    @OnNuiEvent(NuiEvent.PhoneEmergencyCallUHU)
    async phoneEmergencyCallUHU() {
        TriggerServerEvent(ServerEvent.LSMC_REVIVE, null, true, true);
        this.phoneManager.hidePhone();
    }

    @Tick(TickInterval.EVERY_SECOND * 2)
    async updateTime() {
        const hour: number = GetClockHours();
        const minute: number = GetClockMinutes();

        this.nuiDispatch.dispatch('phone', 'SetTime', { hour, minute });
    }
}
