import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PlayerVehicleState } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { ProgressService } from '../player/progress.service';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleStateProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Tick(TickInterval.EVERY_SECOND)
    public updateVehiclesCondition() {
        // Basically we keep tracks of all vehicles spawned and ask the current owner to update the condition of the vehicle
        const netIds = this.vehicleStateService.getSpawned();

        for (const netId of netIds) {
            const entityId = NetworkGetEntityFromNetworkId(netId);
            const owner = NetworkGetEntityOwner(entityId);

            if (!owner) {
                continue;
            }

            TriggerClientEvent(ClientEvent.VEHICLE_CHECK_CONDITION, owner, netId);
        }
    }

    @OnEvent(ServerEvent.VEHICLE_SET_DEAD)
    public onVehicleDead(source: number, vehicleId: number) {
        this.prismaService.playerVehicle.update({
            where: {
                id: vehicleId,
            },
            data: {
                state: PlayerVehicleState.Destroyed,
            },
        });

        // @TODO Monitoring
    }

    @OnEvent(ServerEvent.VEHICLE_WASH)
    public async onVehicleWash(source: number, vehicleId: number) {
        if (this.playerMoneyService.remove(source, 50)) {
            const { completed } = await this.progressService.progress(
                source,
                'cleaning_vehicle',
                'Lavage du véhicule...',
                10000,
                {
                    task: 'WORLD_HUMAN_MAID_CLEAN',
                },
                {
                    disableMovement: true,
                    disableCarMovement: true,
                    disableMouse: false,
                    disableCombat: true,
                }
            );
            if (completed) {
                const entityId = NetworkGetEntityFromNetworkId(vehicleId);
                const owner = NetworkGetEntityOwner(entityId);
                TriggerClientEvent(ClientEvent.VEHICLE_UPDATE_DIRT_LEVEL, owner, vehicleId, 0);

                this.notifier.notify(source, 'Votre véhicule a été lavé.', 'success');
            } else {
                this.notifier.notify(source, 'Lavage échoué.', 'error');
            }
        } else {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');
        }
    }
}
