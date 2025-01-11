import { Module } from '../../../core/decorators/module';
import { UpwFacilityProvider } from './upw.facility.provider';
import { UpwHalloweenProvider } from './upw.halloween.provider';
import { UpwObjectProvider } from './upw.object.provider';
import { UpwPollutionProvider } from './upw.pollution.provider';
import { UpwResellProvider } from './upw.resell.provider';
import { UpwStationProvider } from './upw.station.provider';
import { UpwVehicleProvider } from './upw.vehicle.provider';

@Module({
    providers: [
        UpwFacilityProvider,
        UpwHalloweenProvider,
        UpwObjectProvider,
        UpwStationProvider,
        UpwVehicleProvider,
        UpwResellProvider,
        UpwPollutionProvider,
    ],
})
export class UpwModule {}
