import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { HousingRepository } from '../repository/housing.repository';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class HousingZoneProvider {
    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Once(OnceStep.RepositoriesLoaded)
    public loadZones() {
        const properties = this.housingRepository.get();

        for (const property of properties) {
            this.targetFactory.createForBoxZone(`housing:property:${property.id}`, property.entryZone, [
                // Buy
                // Sell
                // Visit
                // Bell
                // Enter
                // Garage
                // Add roommate
                // Remove roommate
                // Leave as roommate
            ]);

        }
    }
}
