import { Module } from '../../core/decorators/module';
import { HousingApartmentZoneProvider } from './housing.apartment.zone.provider';
import { HousingFournitureProvider } from './housing.fourniture.provider';
import { HousingMenuProvider } from './housing.menu.provider';
import { HousingPropertyZoneProvider } from './housing.property.zone.provider';
import { HousingProvider } from './housing.provider';

@Module({
    providers: [
        HousingApartmentZoneProvider,
        HousingMenuProvider,
        HousingPropertyZoneProvider,
        HousingProvider,
        HousingFournitureProvider,
    ],
})
export class HousingModule {}
