import { Module } from '../../../core/decorators/module';
import { UpwChargerProvider } from './upw.charger.provider';
import { UpwHalloweenProvider } from './upw.halloween.provider';
import { UpwMenuProvider } from './upw.menu.provider';
import { UpwVehicleProvider } from './upw.vehicle.provider';

@Module({
    providers: [UpwMenuProvider, UpwHalloweenProvider, UpwChargerProvider, UpwVehicleProvider],
})
export class UpwModule {}
