import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcEvent } from '../../shared/rpc';
import { getDefaultVehicleModification, VehicleModification } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleCustomProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Rpc(RpcEvent.VEHICLE_CUSTOM_SET_MODS)
    public async setMods(source: number, vehicleNetworkId: number, mods: VehicleModification, price: number | null) {
        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(entityId);

        if (!state.id) {
            this.notifier.notify(source, 'Vous ne pouvez pas modifier un vehicule non existant', 'error');
            return getDefaultVehicleModification();
        }

        const playerVehicle = await this.prismaService.playerVehicle.findUnique({
            where: {
                id: state.id,
            },
        });

        if (!playerVehicle) {
            return getDefaultVehicleModification();
        }

        if (!this.playerMoneyService.remove(source, price)) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');

            return {
                ...getDefaultVehicleModification(),
                ...JSON.parse(playerVehicle.mods || '{}'),
            };
        }

        await this.prismaService.playerVehicle.update({
            where: {
                id: playerVehicle.id,
            },
            data: {
                mods: JSON.stringify(mods),
            },
        });

        return mods;
    }

    @Rpc(RpcEvent.VEHICLE_CUSTOM_GET_MODS)
    public async getMods(source: number, vehicleNetworkId: number): Promise<VehicleModification> {
        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(entityId);

        if (!state.id) {
            return getDefaultVehicleModification();
        }

        const playerVehicle = await this.prismaService.playerVehicle.findUnique({
            where: {
                id: state.id,
            },
        });

        if (!playerVehicle) {
            return getDefaultVehicleModification();
        }

        return {
            ...getDefaultVehicleModification(),
            ...JSON.parse(playerVehicle.mods || '{}'),
        };
    }
}
