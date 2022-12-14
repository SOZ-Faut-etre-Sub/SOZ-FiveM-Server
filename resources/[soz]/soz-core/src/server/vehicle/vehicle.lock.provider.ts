import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event';
import { RpcEvent } from '../../shared/rpc';
import { PlayerService } from '../player/player.service';
import { VehiclePlayerRepository } from './vehicle.player.repository';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleLockProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(VehiclePlayerRepository)
    private vehiclePlayerRepository: VehiclePlayerRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private trunkOpened: Record<number, Set<number>> = {};

    @OnEvent(ServerEvent.VEHICLE_SET_TRUNK_STATE)
    async onSetTrunkState(source: number, vehicleNetworkId: number, state: boolean) {
        const set = this.trunkOpened[vehicleNetworkId] || new Set();

        if (state) {
            set.add(source);
        } else {
            set.delete(source);
        }

        this.trunkOpened[vehicleNetworkId] = set;

        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const owner = NetworkGetEntityOwner(entityId);

        if (set.size > 0) {
            TriggerClientEvent(ServerEvent.VEHICLE_SET_TRUNK_STATE, owner, vehicleNetworkId, true);
        } else {
            TriggerClientEvent(ServerEvent.VEHICLE_SET_TRUNK_STATE, owner, vehicleNetworkId, false);
            delete this.trunkOpened[vehicleNetworkId];
        }
    }

    @OnEvent(ServerEvent.VEHICLE_TAKE_OWNER)
    private onVehicleTakeOwner(source: number, vehicleNetworkId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const vehicleEntityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const plate = GetVehicleNumberPlateText(vehicleEntityId);

        this.vehicleStateService.addVehicleKey(plate, player.citizenid);
        this.vehicleStateService.updateVehicleState(vehicleEntityId, {
            open: true,
            owner: player.citizenid,
        });
    }

    @OnEvent(ServerEvent.PLAYER_UPDATE_HAT_VEHICLE)
    async onPlayerUpdateHatVehicle(source: number, hat: number, texture: number) {
        const entity = GetPlayerPed(source);

        if (!entity) {
            return;
        }

        SetPedPropIndex(entity, 0, hat, texture, true);
    }

    @Rpc(RpcEvent.VEHICLE_HAS_KEY)
    public async hasVehicleKey(source: number, vehicleId: number): Promise<boolean> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return false;
        }

        const vehicle = await this.vehiclePlayerRepository.find(vehicleId);

        if (!vehicle) {
            return false;
        }

        return this.vehicleStateService.hasVehicleKey(vehicle.plate, player.citizenid);
    }

    @OnEvent(ServerEvent.VEHICLE_SET_OPEN)
    async onOpen(source: number, vehicleNetworkId: number, open: boolean) {
        const vehicleEntityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        this.vehicleStateService.updateVehicleState(vehicleEntityId, {
            open,
        });
    }

    @OnEvent(ServerEvent.VEHICLE_FORCE_OPEN)
    async onForceOpen(source: number, vehicleNetworkId: number) {
        const vehicleEntityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        this.vehicleStateService.updateVehicleState(vehicleEntityId, {
            forced: true,
        });
    }
}
