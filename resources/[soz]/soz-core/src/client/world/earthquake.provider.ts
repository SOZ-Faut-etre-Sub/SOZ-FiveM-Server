import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { wait } from '@public/core/utils';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { VehicleSeat } from '@public/shared/vehicle/vehicle';

import { Provider } from '../../core/decorators/provider';
import { SoundService } from '../sound.service';

@Provider()
export class EarthquakeProvider {
    @Inject(SoundService)
    public soundService: SoundService;

    @OnNuiEvent(NuiEvent.AdminMenuEarthquake)
    public async onHighWave(): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_EARTHQUAKE);
    }

    private async shakeCam() {
        for (let i = 0; i < 10; i++) {
            ShakeGameplayCam('MEDIUM_EXPLOSION_SHAKE', 0.5);
            await wait(500);
        }
        for (let i = 0; i < 5; i++) {
            ShakeGameplayCam('MEDIUM_EXPLOSION_SHAKE', 0.5 - 0.1 * i);
            await wait(500);
        }
        ShakeGameplayCam('MEDIUM_EXPLOSION_SHAKE', 0.0);
    }

    @OnEvent(ClientEvent.EARTHQUAKE)
    public async earthquake() {
        this.soundService.play('earthquake/earthquake', 0.5);
        await wait(2000);

        const cars = GetGamePool('CVehicle');
        const objs = GetGamePool('CObject');
        for (const obj of objs) {
            if (!NetworkGetEntityIsNetworked(obj)) {
                BreakObjectFragmentChild(obj, 0, false);
                ApplyForceToEntityCenterOfMass(obj, 1, 0, 0.0, 10.0, false, false, true, false);
            }
        }
        for (const veh of cars) {
            if (NetworkHasControlOfEntity(veh)) {
                if (!IsVehicleEngineOn(veh)) {
                    SetVehicleAlarm(veh, true);
                    StartVehicleAlarm(veh);
                } else {
                    const driver = GetPedInVehicleSeat(veh, VehicleSeat.Driver);
                    if (driver && !IsPedAPlayer(driver)) {
                        SetVehicleOutOfControl(veh, true, false);
                    }
                }
            }
        }
        this.shakeCam();

        for (let i = 0; i < 50; i++) {
            await wait(100);
            for (const obj of objs) {
                if (!NetworkGetEntityIsNetworked(obj)) {
                    const rand = Math.random() * 2 * Math.PI;
                    ApplyForceToEntityCenterOfMass(
                        obj,
                        1,
                        4 * Math.cos(rand),
                        4 * Math.sin(rand),
                        rand - Math.PI,
                        false,
                        false,
                        true,
                        false
                    );
                }
            }
        }
    }
}
