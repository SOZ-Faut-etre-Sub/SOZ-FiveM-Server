import { Inject, Injectable } from '../../../core/decorators/injectable';
import { Err, Ok, Result } from '../../../shared/result';
import { VehicleService } from '../../vehicle/vehicle.service';

const modificationPrice = [
    { name: 'modEngine', id: 11, prices: [0, 0.1, 0.15, 0.2, 0.25, 0.3] },
    { name: 'modBrakes', id: 12, prices: [0, 0.08, 0.1, 0.12, 0.14, 0.16] },
    { name: 'modTransmission', id: 13, prices: [0, 0.08, 0.11, 0.14, 0.17, 0.2] },
    { name: 'modSuspension', id: 15, prices: [0, 0.06, 0.09, 0.12, 0.15, 0.18] },
    { name: 'modArmor', id: 16, prices: [0, 0.25, 0.35, 0.45, 0.55, 0.65] },
    { name: 'modTurbo', id: 18, prices: [0.2] },
];

@Injectable()
export class EstimationService {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    public async estimateVehicle(source: number, networkId: number, properties: any): Promise<Result<number, string>> {
        const model = GetEntityModel(NetworkGetEntityFromNetworkId(networkId));

        console.log('model', model);
        const vehicle = await this.vehicleService.getVehicle(model);
        if (!vehicle) {
            return Err(`Ce véhicule n'est pas ~r~estimable~s~.`);
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

        return Ok(Math.ceil(price));
    }
}
