import { Module } from '../../../core/decorators/module';
import { UpwFacilityProvider } from './upw.facility.provider';
import { UpwOrderProvider } from './upw.order.provider';
import { UpwStationProvider } from './upw.station.provider';
import { UpwVehicleProvider } from './upw.vehicle.provider';

@Module({
    providers: [UpwFacilityProvider, UpwOrderProvider, UpwStationProvider, UpwVehicleProvider],
})
export class UpwModule {}
