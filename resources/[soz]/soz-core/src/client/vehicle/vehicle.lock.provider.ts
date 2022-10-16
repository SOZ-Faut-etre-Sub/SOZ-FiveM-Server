import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { PlayerData } from '../../shared/player';
import { RpcEvent } from '../../shared/rpc';
import { getVehicleState, setVehicleState, VehicleEntityState } from '../../shared/vehicle';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { SoundService } from '../sound.service';
import { VehicleService } from './vehicle.service';

@Provider()
export class VehicleLockProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(SoundService)
    private soundService: SoundService;

    @Tick(TickInterval.EVERY_FRAME)
    private async checkPlayerCanEnterVehicle() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsTryingToEnter(ped);

        if (!vehicle) {
            return;
        }

        const vehicleState = getVehicleState(vehicle);

        if (vehicleState.forced || player.metadata.godmode || vehicleState.open) {
            SetVehicleDoorsLocked(vehicle, 0);
        } else {
            SetVehicleDoorsLocked(vehicle, 2);
        }
    }

    @Command('soz_vehicle_toggle_vehicle_lock', {
        description: 'Ouvrir/fermer le véhicule',
        keys: [
            {
                mapper: 'keyboard',
                key: 'U',
            },
        ],
    })
    async toggleVehicleLock() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (exports['soz-phone'].isPhoneVisible()) {
            return;
        }

        const vehicle = this.vehicleService.getClosestVehicle();

        if (!vehicle) {
            this.notifier.notify('Aucun vehicule à proximité.', 'error');

            return;
        }

        if (GetEntitySpeed(vehicle) * 3.6 > 75) {
            this.notifier.notify('Vous allez trop vite pour faire ça.', 'error');

            return;
        }

        const state = getVehicleState(vehicle);
        const hasVehicleKey = await this.hasVehicleKey(player, state);

        if (!hasVehicleKey) {
            this.notifier.notify("Vous n'avez pas les clés..", 'error');

            return;
        }

        setVehicleState(vehicle, {
            open: !state.open,
        });

        if (state.open) {
            this.soundService.playAround('vehicle/lock', 5, 0.1);
        } else {
            this.soundService.playAround('vehicle/unlock', 5, 0.1);
        }

        SetVehicleLights(vehicle, 2);
        await wait(250);
        SetVehicleLights(vehicle, 1);
        await wait(200);
        SetVehicleLights(vehicle, 0);
    }

    private async hasVehicleKey(player: PlayerData, state: VehicleEntityState) {
        // Case for temporary care, only owner can unlock / lock vehicle
        if (state.id === null) {
            return state.owner === player.citizenid;
        }

        if (state.owner === player.citizenid) {
            return true;
        }

        return await emitRpc<boolean>(RpcEvent.VEHICLE_HAS_KEY, state.id);
    }
}
