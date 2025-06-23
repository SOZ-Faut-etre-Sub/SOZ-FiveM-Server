import { Notifier } from '@public/client/notifier';
import { PlayerService } from '@public/client/player/player.service';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { VehicleRepository } from '@public/client/repository/vehicle.repository';
import { VehicleSirenRepository } from '@public/client/repository/vehicle.siren.repository';
import { wait } from '@public/core/utils';
import { ServerEvent } from '@public/shared/event';
import { NuiEvent } from '@public/shared/event/nui';
import { GyroModel, GyroOffset, VehicleWithSirens } from '@public/shared/job/police';

import { Command } from '../../../core/decorators/command';
import { OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick } from '../../../core/decorators/tick';
import { VehicleSeat } from '../../../shared/vehicle/vehicle';
import { VehicleStateService } from '../../vehicle/vehicle.state.service';

@Provider()
export class PoliceSirenProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(VehicleSirenRepository)
    private vehicleSirenRepository: VehicleSirenRepository;

    @Inject(Notifier)
    private notifier: Notifier;

    private soundIds = new Map<number, number>();

    private handleSirenUpdate(vehicle: number, state: boolean, netId?: number) {
        const model = GetEntityModel(vehicle);
        if (VehicleWithSirens[model]) {
            SetVehicleHasMutedSirens(vehicle, !state);
        } else {
            netId ??= VehToNet(vehicle);
            let sound = this.soundIds.get(netId);
            if (sound == null && state) {
                sound = GetSoundId();
                PlaySoundFromEntity(sound, 'VEHICLES_HORNS_SIREN_1', vehicle, '', false, 0);
                this.soundIds.set(netId, sound);
            }
            if (sound != null && !state) {
                StopSound(sound);
                ReleaseSoundId(sound);
                this.soundIds.delete(netId);
            }
        }
    }

    @Tick(1000)
    public async checkSirenMutedLoop() {
        const sirenStates = this.vehicleSirenRepository.raw();

        const extraNetIds = new Set(this.soundIds.keys());
        for (const [vehicleNetIdStr, state] of Object.entries(sirenStates)) {
            const vehicleNetId = parseInt(vehicleNetIdStr);
            if (!NetworkDoesEntityExistWithNetworkId(vehicleNetId)) {
                continue;
            }

            const veh = NetToVeh(vehicleNetId);
            if (!veh) {
                continue;
            }

            this.handleSirenUpdate(veh, state, vehicleNetId);
            extraNetIds.delete(vehicleNetId);
        }

        for (const extraNetId of extraNetIds) {
            const sound = this.soundIds.get(extraNetId);
            StopSound(sound);
            ReleaseSoundId(sound);
            this.soundIds.delete(extraNetId);
        }
    }

    @Command('togglesirens', {
        description: 'Sirène - passer du code 3 au code 2',
        keys: [{ mapper: 'keyboard', key: 'UP' }],
    })
    public async onToggleSirens() {
        const player = this.playerService.getPlayer();
        if (!player || player.metadata.ishandcuffed || player.metadata.isdead) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        if (GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) !== ped) {
            return false;
        }

        const state = await this.vehicleStateService.getVehicleState(vehicle);
        if (!VehicleWithSirens[GetEntityModel(vehicle)] && !state.gyro) {
            return false;
        }

        this.vehicleStateService.updateVehicleState(vehicle, {
            isSirenMuted: !state.isSirenMuted,
        });

        const vehicleNetId = VehToNet(vehicle);
        const sirenStates = this.vehicleSirenRepository.raw();
        sirenStates[vehicleNetId] = state.isSirenMuted;
        this.handleSirenUpdate(vehicle, state.isSirenMuted, vehicleNetId);
    }

    @OnNuiEvent(NuiEvent.VehicleGyro)
    public async onGyro(value: boolean) {
        const playerPed = PlayerPedId();
        const veh = GetVehiclePedIsIn(playerPed, false);
        if (!veh) {
            return;
        }

        const vehModel = GetEntityModel(veh);
        if (VehicleWithSirens[vehModel]) {
            return;
        }

        const state = await this.vehicleStateService.getVehicleState(veh);
        if ((state.gyro && value) || (!state.gyro && !value)) {
            return;
        }

        const vehicleNetId = VehToNet(veh);
        if (!value && state.gyro) {
            TriggerServerEvent(ServerEvent.VEHICLE_GYRO_REMOVE, VehToNet(veh));
            const sirenStates = this.vehicleSirenRepository.raw();
            sirenStates[vehicleNetId] = false;
            this.handleSirenUpdate(veh, false, vehicleNetId);
            return;
        }

        const vehDef = this.vehicleRepository.getByModelHash(vehModel);
        const isSuper = vehDef ? vehDef.category == 'Super' : GetVehicleClass(veh) == 7;
        if (isSuper) {
            this.notifier.error('Véhicule incompatible.');
            return;
        }

        const coords = GetWorldPositionOfEntityBone(veh, GetEntityBoneIndexByName(veh, 'seat_dside_f'));
        const handle = StartExpensiveSynchronousShapeTestLosProbe(
            coords[0],
            coords[1],
            coords[2] + 4,
            coords[0],
            coords[1],
            coords[2] - 1,
            2,
            0,
            4
        );

        let result: [number, any, number[], number[], number];
        do {
            result = GetShapeTestResult(handle);
            await wait(0);
        } while (result[0] == 1);

        if (result[2][2] - coords[2] < 0.6) {
            this.notifier.error('Véhicule incompatible.');
            return;
        }

        const offset = GetOffsetFromEntityGivenWorldCoords(veh, result[2][0], result[2][1], result[2][2]);

        const model = GyroModel;
        await this.resourceLoader.loadModel(model);
        const gyro = CreateObjectNoOffset(model, result[2][0], result[2][1], result[2][2], true, true, false);
        this.resourceLoader.unloadModel(model);

        AttachEntityToEntity(
            gyro,
            veh,
            0,
            offset[0],
            offset[1],
            offset[2] - (GyroOffset[vehModel] ?? 0.01),
            -90,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            true
        );

        while (!NetworkGetEntityIsNetworked(gyro)) {
            NetworkRegisterEntityAsNetworked(gyro);
            await wait(100);
        }

        const networkId = NetworkGetNetworkIdFromEntity(gyro);
        SetNetworkIdExistsOnAllMachines(networkId, true);

        this.vehicleStateService.updateVehicleState(veh, {
            isSirenMuted: false,
            gyro: networkId,
        });

        const sirenStates = this.vehicleSirenRepository.raw();
        sirenStates[vehicleNetId] = true;
        this.handleSirenUpdate(veh, true, vehicleNetId);
    }
}
