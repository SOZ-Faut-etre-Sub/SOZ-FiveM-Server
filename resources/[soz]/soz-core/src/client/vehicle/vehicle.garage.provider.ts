import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { BlipFactory } from '../blip';
import { GarageRepository } from '../resources/garage.repository';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class VehicleGarageProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(GarageRepository)
    private garageRepository: GarageRepository;

    @Once(OnceStep.RepositoriesLoaded)
    public async init() {
        const garageList = this.garageRepository.get();

        for (const garageIdentifier of Object.keys(garageList)) {
            const garage = garageList[garageIdentifier];

            this.blipFactory.remove(`garage_${garageIdentifier}`);
            this.blipFactory.create(`garage_${garageIdentifier}`, {
                name: 'Parking privé',
                coords: { x: garage.zone.center[0], y: garage.zone.center[1], z: garage.zone.center[2] },
                sprite: 357,
                color: 5,
            });
        }
    }
}
