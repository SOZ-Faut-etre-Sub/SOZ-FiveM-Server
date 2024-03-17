import { Module } from '../../../core/decorators/module';
import { UpwFacilityProvider } from './upw.facility.provider';
import { UpwObjectProvider } from './upw.object.provider';
import { UpwStationProvider } from './upw.station.provider';
import { UpwVehicleProvider } from './upw.vehicle.provider';

@Module({
    providers: [UpwFacilityProvider, UpwObjectProvider, UpwStationProvider, UpwVehicleProvider],
})
export class UpwModule {}
