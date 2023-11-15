import { Module } from '../../core/decorators/module';
import { HousingApartmentZoneProvider } from './housing.apartment.zone.provider';
import { HousingMenuProvider } from './housing.menu.provider';
import { HousingPropertyZoneProvider } from './housing.property.zone.provider';
import { HousingProvider } from './housing.provider';

@Module({
    providers: [HousingApartmentZoneProvider, HousingMenuProvider, HousingPropertyZoneProvider, HousingProvider],
})
export class HousingModule {}
