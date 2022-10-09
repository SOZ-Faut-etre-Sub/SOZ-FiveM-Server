import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { BennysConfig } from '../../../shared/job/bennys';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';
import { QBCore } from '../../qbcore';
import { VehicleService } from '../../vehicle/vehicle.service';

const modificationPrice = [
    { name: 'modEngine', id: 11, prices: [0, 0.1, 0.15, 0.2, 0.25, 0.3] },
    { name: 'modBrakes', id: 12, prices: [0, 0.08, 0.1, 0.12, 0.14, 0.16] },
    { name: 'modTransmission', id: 13, prices: [0, 0.08, 0.11, 0.14, 0.17, 0.2] },
    { name: 'modSuspension', id: 15, prices: [0, 0.06, 0.09, 0.12, 0.15, 0.18] },
    { name: 'modArmor', id: 16, prices: [0, 0.25, 0.35, 0.45, 0.55, 0.65] },
    { name: 'modTurbo', id: 18, prices: [0.2] },
];

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

        const model = GetEntityModel(NetworkGetEntityFromNetworkId(networkId));

        const vehicle = await this.vehicleService.getVehicle(model);
        if (!vehicle) {
            this.notifier.notify(source, `Ce véhicule n'est pas ~r~estimable~s~.`, 'error');
            return;
        }
        const basePrice = vehicle.price;

        let price = basePrice;
        for (const property of Object.keys(properties)) {
            const mod = modificationPrice.find(m => m.name === property);
            if (mod) {
                let modPrice = mod.prices[properties[property] + 1];
                if (mod.name === 'modTurbo') {
                    modPrice = properties[property] ? mod.prices[0] : 0;
                }
                price += basePrice * modPrice;
            }
        }

        this.notifier.notify(source, `Le prix du véhicule est estimé à ~g~$${price.toLocaleString()}~s~ !`, 'success');
    }
}
