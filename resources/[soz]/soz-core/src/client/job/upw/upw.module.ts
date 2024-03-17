import { Module } from '../../../core/decorators/module';
import { UpwChargerProvider } from './upw.charger.provider';
import { UpwMenuProvider } from './upw.menu.provider';
import { UpwVehicleProvider } from './upw.vehicle.provider';

@Module({
    providers: [UpwMenuProvider, UpwChargerProvider, UpwVehicleProvider],
})
export class UpwModule {}
