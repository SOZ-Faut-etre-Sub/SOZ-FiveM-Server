import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcEvent } from '../../shared/rpc';
import { getDefaultVehicleConfiguration, VehicleConfiguration } from '../../shared/vehicle/modification';
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
    public async setMods(
        source: number,
        vehicleNetworkId: number,
        mods: VehicleConfiguration,
        originalConfiguration: VehicleConfiguration,
        price: number | null
    ) {
        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(entityId);

        const playerVehicle = state.id
            ? await this.prismaService.playerVehicle.findUnique({
                  where: {
                      id: state.id,
                  },
              })
            : null;

        if (price && !this.playerMoneyService.remove(source, price)) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');

            return originalConfiguration;
        }

        if (playerVehicle) {
            await this.prismaService.playerVehicle.update({
                where: {
                    id: playerVehicle.id,
                },
                data: {
                    mods: JSON.stringify(mods),
                },
            });
        }

        if (price) {
            this.notifier.notify(source, `Vous avez payé $${price.toFixed(0)} pour modifier votre véhicule.`);
        } else {
            this.notifier.notify(source, 'Le véhicule a été modifié');
        }

        return mods;
    }

    @Rpc(RpcEvent.VEHICLE_CUSTOM_GET_MODS)
    public async getMods(source: number, vehicleNetworkId: number): Promise<VehicleConfiguration> {
        const entityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const state = this.vehicleStateService.getVehicleState(entityId);

        if (!state.id) {
            return getDefaultVehicleConfiguration();
        }

        const playerVehicle = await this.prismaService.playerVehicle.findUnique({
            where: {
                id: state.id,
            },
        });

        if (!playerVehicle) {
            return getDefaultVehicleConfiguration();
        }

        return {
            ...getDefaultVehicleConfiguration(),
            ...JSON.parse(playerVehicle.mods || '{}'),
        };
    }
}
