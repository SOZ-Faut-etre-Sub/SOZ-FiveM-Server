import { PlayerService } from '@public/client/player/player.service';

import { Command } from '../../../core/decorators/command';
import { Once } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick } from '../../../core/decorators/tick';
import { emitRpc } from '../../../core/rpc';
import { RpcServerEvent } from '../../../shared/rpc';
import { VehicleSeat } from '../../../shared/vehicle/vehicle';
import { VehicleStateService } from '../../vehicle/vehicle.state.service';

export const VehicleWithSirens = {
    // LSMC
    [GetHashKey('ambulance')]: true,
    [GetHashKey('ambulance2')]: true,
    [GetHashKey('ambcar')]: true,
    [GetHashKey('lguard')]: true,
    [GetHashKey('firetruk')]: true,
    // LSPD
    [GetHashKey('police')]: true,
    [GetHashKey('police2')]: true,
    [GetHashKey('police3')]: true,
    [GetHashKey('police4')]: true,
    [GetHashKey('police5')]: true,
    [GetHashKey('lspd10')]: true,
    [GetHashKey('lspd11')]: true,
    [GetHashKey('lspd12')]: true,
    [GetHashKey('lspd20')]: true,
    [GetHashKey('lspd21')]: true,
    [GetHashKey('lspd30')]: true,
    [GetHashKey('lspd40')]: true,
    [GetHashKey('lspd41')]: true,
    [GetHashKey('lspd50')]: true,
    [GetHashKey('lspd51')]: true,
    // BCSO
    [GetHashKey('sheriff')]: true,
    [GetHashKey('sheriff2')]: true,
    [GetHashKey('sheriff3')]: true,
    [GetHashKey('sheriff4')]: true,
    [GetHashKey('sheriffb')]: true,
    [GetHashKey('bcso10')]: true,
    [GetHashKey('bcso11')]: true,
    [GetHashKey('bcso12')]: true,
    [GetHashKey('bcso20')]: true,
    [GetHashKey('bcso21')]: true,
    [GetHashKey('bcso30')]: true,
    [GetHashKey('bcso40')]: true,
    [GetHashKey('bcso41')]: true,
    [GetHashKey('bcso50')]: true,
    [GetHashKey('bcso51')]: true,
    // LSPD + BCSO
    [GetHashKey('pbus')]: true,
    //SASP
    [GetHashKey('sasp1')]: true,
    // FBI
    [GetHashKey('fbi')]: true,
    [GetHashKey('fbi2')]: true,
    [GetHashKey('cogfbi')]: true,
    [GetHashKey('paragonfbi')]: true,
    [GetHashKey('dodgebana')]: true,
    [GetHashKey('polgauntlet')]: true,
};

@Provider()
export class PoliceSirenProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Once()
    public initStateSelector() {
        this.vehicleStateService.addVehicleStateSelector(
            [state => state.isSirenMuted],
            this.handleSirenUpdate.bind(this)
        );
    }

    private handleSirenUpdate(vehicle: number, muted: boolean) {
        SetVehicleHasMutedSirens(vehicle, muted);
    }

    @Tick(1000)
    public async checkSirenMutedLoop() {
        const vehicles = GetGamePool('CVehicle');
        const checkVehicles = [];

        for (const vehicleId of vehicles) {
            if (!IsVehicleSirenOn(vehicleId)) {
                continue;
            }

            const model = GetEntityModel(vehicleId);

            if (!VehicleWithSirens[model]) {
                continue;
            }

            const ped = GetPedInVehicleSeat(vehicleId, VehicleSeat.Driver);

            if (!IsPedAPlayer(ped)) {
                continue;
            }

            checkVehicles.push(NetworkGetNetworkIdFromEntity(vehicleId));
        }

        if (checkVehicles.length === 0) {
            return;
        }

        const muted = await emitRpc<{ vehicle: number; isSirenMuted: boolean }[]>(
            RpcServerEvent.VEHICLE_GET_MUTED_SIRENS,
            checkVehicles
        );

        for (const { vehicle, isSirenMuted } of muted) {
            const vehicleId = NetworkGetEntityFromNetworkId(vehicle);
            const hasSoundOn = IsVehicleSirenAudioOn(vehicleId);

            if (!!hasSoundOn !== !isSirenMuted) {
                SetVehicleHasMutedSirens(vehicleId, isSirenMuted);
            }
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

        this.vehicleStateService.updateVehicleState(vehicle, {
            isSirenMuted: !state.isSirenMuted,
        });
    }
}
