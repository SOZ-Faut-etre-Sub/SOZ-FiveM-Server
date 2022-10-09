import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { BennysConfig } from '../../../shared/job/bennys';
import { isErr } from '../../../shared/result';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';
import { QBCore } from '../../qbcore';
import { VehicleService } from '../../vehicle/vehicle.service';
import { EstimationService } from './estimationService';

@Provider()
export class BennysEstimateProvider {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(EstimationService)
    private estimateService: EstimationService;

    @OnEvent(ServerEvent.BENNYS_ESTIMATE_VEHICLE)
    public async onEstimateVehicle(source: number, networkId: number, properties: any) {
        const { completed } = await this.progressService.progress(
            source,
            'vehicle_estimate',
            'Vous estimez le véhicule.',
            BennysConfig.Estimate.duration,
            {
                name: 'base',
                dictionary: 'missheistdockssetup1clipboard@base',
                flags: 1,
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
                firstProp: {
                    model: 'prop_notepad_01',
                    bone: 18905,
                    coords: { x: 0.1, y: 0.02, z: 0.08 },
                    rotation: { x: -80.0, y: 0.0, z: 0.0 },
                },
                secondProp: {
                    model: 'prop_pencil_01',
                    bone: 58866,
                    coords: { x: 0.12, y: -0.02, z: 0.001 },
                    rotation: { x: -150.0, y: 0.0, z: 0.0 },
                },
            }
        );

        if (!completed) {
            return;
        }

        const result = await this.estimateService.estimateVehicle(source, networkId, properties);

        if (isErr(result)) {
            this.notifier.notify(source, result.err);
            return;
        }

        const price = result.ok;

        this.notifier.notify(source, `Le prix du véhicule est estimé à ~g~$${price.toLocaleString()}~s~ !`, 'success');
    }
}
