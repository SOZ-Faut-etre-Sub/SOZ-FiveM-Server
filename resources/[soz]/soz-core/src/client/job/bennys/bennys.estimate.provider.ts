import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { JobPermission, JobType } from '../../../shared/job';
import { PlayerService } from '../../player/player.service';
import { Qbcore } from '../../qbcore';
import { TargetFactory } from '../../target/target.factory';
import { VehicleModificationService } from '../../vehicle/vehicle.modification.service';

@Provider()
export class BennysEstimateProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(Qbcore)
    private QBCore: Qbcore;

    @Inject(VehicleModificationService)
    private vehicleModificationService: VehicleModificationService;

    @Once(OnceStep.Start)
    public async onStart() {
        this.targetFactory.createForAllVehicle([
            {
                label: 'Estimer',
                icon: 'c:/mechanic/estimate.png',
                job: JobType.Bennys,
                color: JobType.Bennys,
                canInteract: () => {
                    return (
                        this.playerService.isOnDuty() &&
                        this.QBCore.hasJobPermission('bennys', JobPermission.BennysEstimate)
                    );
                },
                action: async vehicle => {
                    const networkId = NetworkGetNetworkIdFromEntity(vehicle);
                    const configuration = this.vehicleModificationService.getVehicleConfiguration(vehicle);

                    TriggerServerEvent(ServerEvent.BENNYS_ESTIMATE_VEHICLE, networkId, configuration);
                },
            },
        ]);
    }
}
