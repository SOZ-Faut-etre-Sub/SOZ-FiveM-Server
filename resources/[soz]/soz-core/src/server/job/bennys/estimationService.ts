import { Inject, Injectable } from '../../../core/decorators/injectable';
import { Err, Ok, Result } from '../../../shared/result';
import { VehicleConfiguration, VehicleModificationPricing } from '../../../shared/vehicle/modification';
import { VehicleService } from '../../vehicle/vehicle.service';

@Injectable()
export class EstimationService {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    public async estimateVehicle(
        source: number,
        networkId: number,
        configuration: VehicleConfiguration
    ): Promise<Result<number, string>> {
        const model = GetEntityModel(NetworkGetEntityFromNetworkId(networkId));
        const vehicle = await this.vehicleService.getVehicle(model);

        if (!vehicle) {
            return Err(`Ce véhicule n'est pas ~r~estimable~s~.`);
        }

        const basePrice = vehicle.price;
        let price = basePrice;

        for (const [key, category] of Object.entries(VehicleModificationPricing)) {
            if (category.type === 'list') {
                const currentLevel = configuration.modification[key];
                const level = category.priceByLevels[currentLevel];

                if (level) {
                    price += basePrice * level;
                }
            }

            if (category.type === 'toggle') {
                const hasCurrent = configuration.modification[key];

                if (hasCurrent) {
                    price += basePrice * category.priceByLevels[1];
                } else {
                    price += basePrice * category.priceByLevels[0];
                }
            }
        }

        return Ok(Math.round(price));
    }
}
