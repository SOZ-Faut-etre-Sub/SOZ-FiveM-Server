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
            ShakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.4);
            await wait(500);
        }
        for (let i = 0; i <= 5; i++) {
            ShakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.4 - 0.08 * i);
            await wait(500);
        }
    }

    @OnEvent(ClientEvent.EARTHQUAKE)
    public async earthquake() {
        this.soundService.play('earthquake/earthquake', 0.5);
        await wait(1000);

        const peds = GetGamePool('CPed');
        const cars = GetGamePool('CVehicle');
        const objs = GetGamePool('CObject');

        const playerPed = PlayerPedId();
        for (const ped of peds) {
            if (NetworkHasControlOfEntity(ped) && !IsPedAPlayer(ped)) {
                TaskReactAndFleePed(ped, playerPed);
            }
        }
        for (const obj of objs) {
            if (!NetworkGetEntityIsNetworked(obj)) {
                BreakObjectFragmentChild(obj, 0, false);
                ApplyForceToEntityCenterOfMass(obj, 1, 0, 0.0, 5.0, false, false, true, false);
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
                        SetVehicleOutOfControl(veh, false, false);
                    }
                }
            }
        }
        this.shakeCam();
        this.shakeVehs(cars, 5000);

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

    private async shakeVehs(cars: number[], duration) {
        const waitTime = 300;
        for (let i = 0; i < duration / waitTime; i++) {
            await wait(waitTime);
            const force = 3 * (i % 2 == 0 ? 1 : -1);
            for (const veh of cars) {
                if (NetworkGetEntityIsNetworked(veh) && NetworkHasControlOfEntity(veh)) {
                    ApplyForceToEntity(veh, 1, force, 0, 0, 0, 0, 0, 1, true, true, true, false, false);
                }
            }
        }
    }
}
