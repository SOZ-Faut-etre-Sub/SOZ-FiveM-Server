import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { VehicleSeat } from '@public/shared/vehicle/vehicle';

import { Provider } from '../../core/decorators/provider';
import { NuiDispatch } from '../nui/nui.dispatch';
import { FuelStationRepository } from '../repository/fuel.station.repository';

@Provider()
export class EarthquakeProvider {
    @Inject(NuiDispatch)
    public nuiDispatch: NuiDispatch;

    @Inject(FuelStationRepository)
    private fuelStationRepository: FuelStationRepository;

    private earthquake = false;
    private inverse = false;
    private ramp = 0;
    private shaking = false;

    @OnNuiEvent(NuiEvent.AdminMenuEarthquake)
    public async onAdminEarthQuake(value: boolean): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_EARTHQUAKE, value);
    }

    @OnEvent(ClientEvent.EARTHQUAKE)
    public async onEarthquake(value: boolean) {
        this.nuiDispatch.dispatch('meteor', 'earthquake', value);
        await wait(1000);

        if (!value) {
            this.earthquake = false;
            return;
        }

        const peds = GetGamePool('CPed');
        const cars = GetGamePool('CVehicle');
        const objs = GetGamePool('CObject');

        const playerPed = PlayerPedId();
        for (const ped of peds) {
            if (NetworkHasControlOfEntity(ped) && !IsPedAPlayer(ped) && !IsEntityPositionFrozen(ped)) {
                TaskReactAndFleePed(ped, playerPed);
            }
        }
        for (const obj of objs) {
            if (!NetworkGetEntityIsNetworked(obj)) {
                const model = GetEntityModel(obj);
                if (this.fuelStationRepository.getModels().includes(model)) {
                    continue;
                }

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

        this.ramp = 0;
        this.earthquake = true;
    }

    @Tick()
    private async shakeObj() {
        if (!this.earthquake) {
            return;
        }

        const objs = GetGamePool('CObject');
        const rand = Math.random() * 2 * Math.PI;
        for (const obj of objs) {
            if (!NetworkGetEntityIsNetworked(obj)) {
                const model = GetEntityModel(obj);
                if (this.fuelStationRepository.getModels().includes(model)) {
                    continue;
                }
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

        await wait(100);
    }

    @Tick()
    private async shakeVehs() {
        if (!this.earthquake) {
            return;
        }

        const cars = GetGamePool('CVehicle');
        const force = 3 * (this.inverse ? 1 : -1);
        for (const veh of cars) {
            if (NetworkGetEntityIsNetworked(veh) && NetworkHasControlOfEntity(veh)) {
                ApplyForceToEntity(veh, 1, force, 0, 0, 0, 0, 0, 1, true, true, true, false, false);
            }
        }
        this.inverse = !this.inverse;

        const playerPed = PlayerPedId();
        if (IsPedWalking(playerPed) || IsPedRunning(playerPed) || IsPedSprinting(playerPed)) {
            SetPedToRagdoll(playerPed, 2000, 2000, 0, false, false, false);
        }

        await wait(300);
    }

    @Tick(0)
    private async shakeCam() {
        if (!this.earthquake) {
            if (this.ramp > 0) {
                this.ramp -= 2;
                SetGameplayCamShakeAmplitude(this.ramp * 0.5);
            } else if (this.shaking) {
                ShakeGameplayCam('SKY_DIVING_SHAKE', 0);
                this.shaking = false;
            }
        } else {
            if (this.ramp == 0) {
                ShakeGameplayCam('SKY_DIVING_SHAKE', 0.5);
                this.shaking = true;
            }
            SetGameplayCamShakeAmplitude(this.ramp * 0.5);
            this.ramp = Math.min(this.ramp + 1, 10);
        }

        await wait(500);
    }
}
